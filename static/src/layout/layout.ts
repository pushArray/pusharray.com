import {Render} from 'layout/render';
import * as dom from 'utils/dom';

export default class Layout implements Render {

  protected _element: HTMLElement;
  protected _columns: HTMLElement[];
  protected _ruler: HTMLElement;
  protected _columnCount = 0;

  constructor() {
    this._columns = [];
    this.createHtml();
  }

  createHtml() {
    this._element = dom.createNode('section', {'class': 'column col-main'});
    this._ruler = dom.createNode('div', {'class': 'column-ruler'});
    this._element.appendChild(this._ruler);
  }

  getShortestColumn(): HTMLElement {
    let shortest: HTMLElement = this._columns[0];
    let maxCol = this._columnCount;
    for (let i = 1; i < maxCol; i++) {
      let col = this._columns[i];
      if (col.offsetHeight < shortest.offsetHeight) {
        shortest = col;
      }
    }
    return shortest;
  }

  getColumnCount(): number {
    let rulerWidth = this._ruler.offsetWidth;
    let containerWidth = this._element.offsetWidth;
    let colCount = Math.round(containerWidth / rulerWidth);
    return isNaN(colCount) ? 0 : colCount;
  }

  createColumns(count: number = this._columnCount): HTMLElement[] {
    for (let i = this._columns.length; i < count; i++) {
      let col = dom.createNode('ul', {
        'class': `column list col-${i + 1}`
      });
      this._columns.push(col);
      this._element.appendChild(col);
    }
    return this._columns;
  }

  emptyColumns() {
    for (let i = 0; i < this._columns.length; i++) {
      let col = this._columns[i];
      let first = col.firstChild;
      while (first) {
        col.removeChild(first);
        first = col.firstChild;
      }
    }
  }

  getColumnIndex(column: HTMLElement): number {
    return this._columns.indexOf(column);
  }

  hideEmptyColumns() {
    for (let i = 0; i < this._columns.length; i++) {
      let col = this._columns[i];
      if (i < this._columnCount) {
        col.style.display = null;
      } else {
        col.style.display = 'none';
      }
    }
  }

  resize(): boolean {
    let colCount = this.getColumnCount();
    this.createColumns(colCount);
    if (colCount !== this._columnCount) {
      this._columnCount = colCount;
      this.hideEmptyColumns();
      return true;
    }
    return false;
  }

  render(container: Node) {
    container.appendChild(this._element);
    this._columnCount = this.getColumnCount();
    this.createColumns(this._columnCount);
    this.hideEmptyColumns();
  }
}
