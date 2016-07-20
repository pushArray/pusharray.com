import {expect} from 'chai';
import Link from 'utils/link';

describe('utils/link.ts', () => {
  it('create new Link', () => {
    let link = new Link;
    expect(link.prev).to.be.undefined;
    expect(link.next).to.be.undefined;

    let prev = new Link;
    link.insertBefore(prev);
    expect(link.prev).to.equal(prev);

    let next = new Link;
    link.insertAfter(next);
    expect(link.next).to.equal(next);

    let middle = new Link;
    next.insertBefore(middle);
    expect(next.prev).to.equal(middle);
    expect(link.next).to.equal(middle);
  });
});
