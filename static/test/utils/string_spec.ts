import {expect} from 'chai';
import {
  replaceHtmlEntities,
  fromTwitterDateTime,
  getDateDiff,
  getPeriod,
  getShortDate,
  getFullDate,
  extractDomain
} from 'utils/string';

describe('utils/string.ts', () => {
  it('replaceHtmlEntities', () => {
    let html = '<span>foo&nbsp;&amp;&quot;&lt;&gt;&nbsp;bar</span>';
    expect(replaceHtmlEntities(html)).to.equal('<span>foo &\'<> bar</span>');
  });

  it('fromTwitterDateTime', () => {
    let date = fromTwitterDateTime('Mon Sep 03 13:24:14 +0000 2012');
    expect(date.getUTCFullYear()).to.equal(2012);
    expect(date.getUTCMonth()).to.equal(8);
    expect(date.getUTCDate()).to.equal(3);
    expect(date.getUTCHours()).to.equal(13);
    expect(date.getUTCMinutes()).to.equal(24);
    expect(date.getUTCSeconds()).to.equal(14);
    expect(date.getUTCDay()).to.equal(1);
  });

  it('getDateDiff', () => {
    let sd = new Date(2015, 0);
    let ed = new Date(2015, 1);
    expect(getDateDiff(ed, sd)).to.equal(86400 * 31);
  });

  it('getPeriod', () => {
    let p = getPeriod(59);
    expect(p.short).to.equal('s');
    expect(p.long).to.equal('Second');

    p = getPeriod(61);
    expect(p.short).to.equal('m');
    expect(p.long).to.equal('Minute');

    p = getPeriod(60);
    expect(p.short).to.equal('m');
    expect(p.long).to.equal('Minute');

    p = getPeriod(2628000);
    expect(p.short).to.equal('M');
    expect(p.long).to.equal('Month');

    p = getPeriod(2628001);
    expect(p.short).to.equal('M');
    expect(p.long).to.equal('Month');

    p = getPeriod(86399);
    expect(p.short).to.equal('h');
    expect(p.long).to.equal('Hour');

    p = getPeriod(86400 * 6);
    expect(p.short).to.equal('d');
    expect(p.long).to.equal('Day');

    p = getPeriod(86400);
    expect(p.short).to.equal('d');
    expect(p.long).to.equal('Day');
  });

  it('getShortDate', () => {
    expect(getShortDate(new Date(1970, 0, 1))).to.equal('January 1970');
    let today = new Date();
    let date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      today.getHours() - 12,
      today.getMinutes(),
      today.getSeconds(),
      today.getSeconds()
    );
    expect(getShortDate(date)).to.equal('Today');

    date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 6,
      today.getHours(),
      today.getMinutes(),
      today.getSeconds(),
      today.getSeconds()
    );
    expect(getShortDate(date)).to.equal('This week');

    date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 25,
      today.getHours(),
      today.getMinutes(),
      today.getSeconds(),
      today.getSeconds()
    );
    expect(getShortDate(date)).to.equal('This month');
  });

  it('getFullDate', () => {
    let date = new Date(1970, 0, 1, 23, 34, 56);
    expect(getFullDate(date)).to.equal('1 January, 1970 - 23:34');
    date = new Date(2015, 3, 22, 14, 56, 34);
    expect(getFullDate(date)).to.equal('22 April, 2015 - 14:56');
  });

  it('extractDomain', () => {
    expect(extractDomain('https://pusharray.com:9543/tweets?sortBy=date#123'))
      .to.equal('pusharray.com');
    expect(extractDomain('pusharray.com/tweets?sortBy=date#123'))
      .to.equal('pusharray.com');
    expect(extractDomain('pusharray.com:8888/tweets#321'))
      .to.equal('pusharray.com');
    expect(extractDomain('http://10.100.111.112:9876/api/tweets'))
      .to.equal('10.100.111.112');
    expect(extractDomain('10.100.111.112:9876')).to.equal('10.100.111.112');
    expect(extractDomain('10.100.111.112')).to.equal('10.100.111.112');
  });
});
