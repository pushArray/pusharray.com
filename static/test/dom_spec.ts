import {createNode} from './exports';

describe('utils/dom.ts', () => {
  it('createNode', () => {
    let el = createNode('div', {
      'id': 'foo',
      'class': 'my class'
    });
    expect(el.nodeName).toBe('DIV');
    expect(el.nodeType).toBe(Node.ELEMENT_NODE);
    expect(el.getAttribute('id')).toBe('foo');
    expect(el.getAttribute('class')).toBe('my class');
  });
});
