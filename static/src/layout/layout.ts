import {Render} from './render';
import {LayoutTemplate} from './template';
import * as dom from '../utils/dom';

class Layout implements Render {

  static createHtml(): HTMLElement {
    let el = dom.createNode('section', {
      'class': 'column col-main'
    });
    el.innerHTML = new LayoutTemplate().get();
    return el;
  }

  private _element: HTMLElement;
  private _columns: NodeList;
  private _columnIndex = 0;

  constructor() {
    this._element = Layout.createHtml();
    this._columns = dom.queryAll('.column.list', this._element);
  }

  getNextColumn(): Node {
    let index = this._columnIndex;
    this._columnIndex = index + 1 > this._columns.length - 1 ? 0 : index + 1;
    return this._columns[index];
  }

  render(container: Node): void {
    container.appendChild(this._element);
  }
}

export default new Layout();
