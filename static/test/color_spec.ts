import {expect} from 'chai';
import {fromHexString} from 'utils/color';

describe('color.ts', () => {
  it('fromHexString', () => {
    expect(fromHexString('#cc0000')).to.equal(13369344);
    expect(fromHexString('#c00')).to.equal(13369344);
    expect(fromHexString('#f00')).to.equal(16711680);
  });
});
