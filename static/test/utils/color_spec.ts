import {expect} from 'chai';
import {
  sliceBits,
  rgbToHsl,
  hexToRgb,
  fromHexString
} from 'utils/color';

describe('utils/color.ts', () => {
  it('sliceBits', () => {
    let ff0000 = 16711680;
    expect(sliceBits(ff0000, 16, 24)).to.equal(255);
    expect(sliceBits(ff0000, 8, 16)).to.equal(0);
    expect(sliceBits(ff0000, 0, 8)).to.equal(0);

    let ffccaa = 16764074;
    expect(sliceBits(ffccaa, 16, 24)).to.equal(255);
    expect(sliceBits(ffccaa, 8, 16)).to.equal(204);
    expect(sliceBits(ffccaa, 0, 8)).to.equal(170);

    let ffffff = 16777215;
    expect(sliceBits(ffffff, 16, 24)).to.equal(255);
    expect(sliceBits(ffffff, 8, 16)).to.equal(255);
    expect(sliceBits(ffffff, 0, 8)).to.equal(255);

    expect(sliceBits(0, 16, 24)).to.equal(0);
    expect(sliceBits(0, 8, 16)).to.equal(0);
    expect(sliceBits(0, 0, 8)).to.equal(0);
  });

  it('rgbToHsl', () => {
    let hsl = rgbToHsl(255, 204, 170);
    expect(hsl).to.eql([24, 100, 83]);
  });

  it('hexToRgb', () => {
    let ffccaa = 16764074;
    let rgb = hexToRgb(ffccaa);
    expect(rgb).to.eql([255, 204, 170]);
  });

  it('fromHexString', () => {
    expect(fromHexString('#cc0000')).to.equal(13369344);
    expect(fromHexString('#c00')).to.equal(13369344);
    expect(fromHexString('#f00')).to.equal(16711680);
    expect(fromHexString('#ff0000')).to.equal(16711680);
  });
});
