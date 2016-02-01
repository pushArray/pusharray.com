import {
  replaceHtmlEntities,
  timeAgo,
  limitString,
  fromTwitterDateTime
} from '../exports';

describe('utils/string.ts', () => {
  it('replaceHtmlEntities', () => {
    let html = '&lt;foo&gt;';
    expect(replaceHtmlEntities(html)).toBe('<foo>');
  });

  it('timeAgo', () => {
    expect(timeAgo(new Date(1970, 0, 1))).toBe('Jan 1, 1970');
  });

  it('limitString', () => {
    let str = 'Lorem ipsum dolor sit amet';

    let limitedStr = limitString(str, 6);
    expect(limitedStr).toBe('Lor...');
    expect(limitedStr.length).toBe(6);

    limitedStr = limitString(str, 10);
    expect(limitedStr).toBe('Lorem i...');
    expect(limitedStr.length).toBe(10);

    limitedStr = limitString(str, str.length);
    expect(limitedStr).toBe(str);
    expect(limitedStr.length).toBe(str.length);

    limitedStr = limitString(str, 17);
    expect(limitedStr).toBe('Lorem ipsum do...');
    expect(limitedStr.length).toBe(17);
  });

  it('fromTwitterDateTime', () => {
    let date = fromTwitterDateTime('Fri Jan 01 15:44:19 +0000 2016');
    expect(date.getUTCMonth()).toBe(0);
    expect(date.getUTCDate()).toBe(1);
    expect(date.getUTCFullYear()).toBe(2016);
    expect(date.getUTCDay()).toBe(5);
    expect(date.getUTCHours()).toBe(15);
    expect(date.getUTCMinutes()).toBe(44);
    expect(date.getUTCSeconds()).toBe(19);
  });
});
