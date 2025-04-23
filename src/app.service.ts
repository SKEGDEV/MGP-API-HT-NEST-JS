import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EncryptionUtil } from './common/utils/encryption.util';
import { SqlService } from './common/database/sql.service';
import * as sql from 'mssql';

@Injectable()
export class AppService {
  constructor(private config: ConfigService, private dbController: SqlService) {}
  private readonly encryptionUtil = new EncryptionUtil();

  async getHello(): Promise<any> {
    const ht_db = await this.encryptionUtil.getKey('ht_db');
    
    const result_DB = await this.dbController.executeProcedure('sp_get_catalogs', [
      {
	name: 'catalog',
	type: sql.Int,
	value: 1
      },
      {
	name: 'country_id',
	type: sql.Int,
	value: 0
      }
    ]); 
    
    
    return result_DB;
  }
}
