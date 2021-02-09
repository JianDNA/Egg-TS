import ImageCode from '../util/imageCode';
module.exports = {
  createImageCode() {
    return ImageCode.createImageCode(this.ctx);
  },
  verifyImageCode(clinetCode) {
    ImageCode.verifyImageCode(this.ctx, clinetCode);
  }
};
