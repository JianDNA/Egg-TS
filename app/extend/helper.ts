import ImageCode from '../util/imageCode';
import EmailCode from '../util/emailCode';
import SmsCode from '../util/smsCode';
import Encrypt from '../util/encrypto';
module.exports = {
  encryptText(text) {
    return Encrypt.encryptText(this, text);
  },
  createImageCode() {
    return ImageCode.createImageCode(this.ctx);
  },
  verifyImageCode(clientCode) {
    ImageCode.verifyImageCode(this.ctx, clientCode);
  },
  async sendEmailCode(to:string) {
    return await EmailCode.sendEmailCode(this.ctx, to);
  },
  verifyEmailCode(clientCode) {
    EmailCode.verifyEmailCode(this.ctx, clientCode);
  },
  async sendSmsCode(to: string) {
    return await SmsCode.sendSmsCode(this.ctx, to);
  },

  verifySmsCodee(clientCode) {
    SmsCode.verifySmsCode(this.ctx, clientCode);
  },
};
