import {expect} from 'chai';
import {
  query,
  createNode
} from 'utils/dom';

describe('utils/dom.ts', () => {
  let root: HTMLElement;
  let child: HTMLElement;

  beforeEach(() => {
    root = createNode('div', {
      'id': 'rootId',
      'class': 'root element'
    });

    child = createNode('div', {
      'id': 'childId',
      'class': 'child element'
    });

    root.appendChild(child);

    for (let i = 0; i < 10; i++) {
      let c = createNode('span', {
        'id': `child${i + 1}`,
        'class': 'children'
      });
      child.appendChild(c);
    }

    document.body.appendChild(root);
  });

  afterEach(() => {
    document.body.removeChild(root);
  });

  it('createNode', () => {
    expect(root.getAttribute('id')).to.equal('rootId');
    expect(root.getAttribute('class')).to.equal('root element');
    expect(root.className).to.equal('root element');
  });

  it('query', () => {
    let e1 = query('#childId > #child1', root);
    expect(e1).to.be.an.instanceof(HTMLElement);

    let e2 = query('#rootId .children', root);
    expect(e2).to.be.an.instanceof(HTMLElement);

    let e3 = query('.root.element > .child.element > #child10.children');
    expect(e3).to.be.an.instanceof(HTMLElement);
  });
});
