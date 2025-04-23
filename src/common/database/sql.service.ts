import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EncryptionUtil } from "../utils/encryption.util";
import * as sql from "mssql";

@Injectable()
export class SqlService{
  constructor(private config: ConfigService) {}
  private readonly encryptionUtil = new EncryptionUtil();
  private pool: sql.ConnectionPool;

  async connect(){
    if(!this.pool){
      const encriptedDBString = await this.encryptionUtil.getKey(this.config.get<string>('DB_KEY') || '');
      const decryptedDBString = await this.encryptionUtil.decrypt(encriptedDBString);

      this.pool = await sql.connect(decryptedDBString);
    }

    return this.pool;
  }

 async executeProcedure<T = any>(
    procedureName: string,
    params: { name: string; type: sql.ISqlTypeFactory; value: any }[]
  ): Promise<T[]> {
    try{
      const pool = await this.connect();
      const request = pool.request();

      for (const param of params) {
	request.input(param.name, param.type, param.value);
      }

      const result = await request.execute<T>(procedureName);
      return result.recordset;
    }catch(e){
      throw e;
    }
  }
}
