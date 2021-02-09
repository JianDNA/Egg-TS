import ImageCode from '../util/imageCode';
import EmailCode from '../util/emailCode';
module.exports = {
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
};
