import {Module, Global} from '@nestjs/common';
import { SqlService } from './database/sql.service';
import { EncryptionUtil } from './utils/encryption.util';
import { Tools } from './utils/tools.util';


@Global()
@Module({
  providers:[SqlService, EncryptionUtil, Tools],
  exports:[SqlService, EncryptionUtil, Tools],
})

export class CommonModule {}


