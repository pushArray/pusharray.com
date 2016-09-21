const doc = document;

type Attributes = {
  [attribute: string]: string
}

export function query(query: string, element: NodeSelector = doc): NodeSelector {
  return element.querySelector(query);
}

/**
 * Creates HTML element.
 */
export function createNode(node: string, attrs: Attributes = {}): HTMLElement {
  let nodeEl: HTMLElement = doc.createElement(node);
  for (let attr in attrs) {
    if (attrs.hasOwnProperty(attr)) {
      nodeEl.setAttribute(attr, attrs[attr]);
    }
  }
  return nodeEl;
}
