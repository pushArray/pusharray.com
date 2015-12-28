import utils from '../src/utils';

describe('utils tests', () => {
  it('createNode', () => {
    var el = utils.createNode('div', {
      'id': 'foo',
      'class': 'my class'
    });
    expect(el.nodeName).toBe('DIV');
    expect(el.nodeType).toBe(Node.ELEMENT_NODE);
    expect(el.getAttribute('id')).toBe('foo');
    expect(el.getAttribute('class')).toBe('my class');
  });

  it('replaceHtmlEntities', () => {
    var html = '&lt;foo&gt;';
    expect(utils.replaceHtmlEntities(html)).toBe('<foo>');
  });

  it('timeAgo', () => {
    expect(utils.timeAgo(new Date(1970, 0, 1))).toBe('Jan 1, 1970');
  });

  it('limitString', () => {
    var str = 'Lorem ipsum dolor sit amet';

    var limitedStr = utils.limitString(str, 6);
    expect(limitedStr).toBe('Lor...');
    expect(limitedStr.length).toBe(6);

    limitedStr = utils.limitString(str, 10);
    expect(limitedStr).toBe('Lorem i...');
    expect(limitedStr.length).toBe(10);

    limitedStr = utils.limitString(str, str.length);
    expect(limitedStr).toBe(str);
    expect(limitedStr.length).toBe(str.length);

    limitedStr = utils.limitString(str, 17);
    expect(limitedStr).toBe('Lorem ipsum do...');
    expect(limitedStr.length).toBe(17);
  });
});
