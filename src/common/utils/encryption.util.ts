import * as crypto from 'crypto';
import * as winreg from 'winreg';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EncryptionUtil{
  constructor(){

  }

  private regKey = new winreg({
    hive: winreg.HKLM, 
    key: '\\SOFTWARE\\MGP'
  }) 

  private async deriveKeyAndIv() {
    const publicKey = await this.getKey('publicKey');
    const privateKey = await this.getKey('secretKey');

    const key = crypto.createHash('sha256').update(publicKey).digest(); // 32 bytes
    const iv = crypto.createHash('md5').update(privateKey).digest(); // 16 bytes

    return { key, iv };
  }

  async encrypt(textPlain: string): Promise<string> {
    try {
      const { key, iv } = await this.deriveKeyAndIv();
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      let encrypted = cipher.update(textPlain, 'utf8', 'base64');
      encrypted += cipher.final('base64');
      return encrypted;
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  }

  async decrypt(encryptedText: string): Promise<string> {
    try {
      const { key, iv } = await this.deriveKeyAndIv();
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      const formattedText = encryptedText.replace(/ /g, '+'); // just in case of spacing issues
      let decrypted = decipher.update(formattedText, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  }
  async getKey(name: string): Promise<string>{
    return new Promise((resolve, reject)=>{
      this.regKey.get(name, (err, item)=>{
	if(err){
	  const fallbackKey = new winreg({
	    hive: winreg.HKLM,
            key: '\\SOFTWARE\\WOW6432Node\\MGP'
          });
          fallbackKey.get(name, (fallbackErr, fallbackItem) => {
            if (fallbackErr) {
              return reject(`Error: ${fallbackErr.message}`);
            }
            resolve(fallbackItem.value);
          });
	}else{
	  resolve(item.value);
	}
      });
    });
  }
  async hashPassword(password: string): Promise<string>{
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, hash: string): Promise<boolean>{
    return bcrypt.compare(password, hash);
  }

}
