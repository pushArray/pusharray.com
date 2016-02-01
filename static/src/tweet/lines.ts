import * as dom from '../utils/dom';
import * as consts from './consts';
import {Word} from './word';

export class Lines {

  private _lines: Line[];

  constructor(private _container: HTMLElement) {
    this._lines = [];
    this._container.style.fontSize = consts.BASE_FONT_SIZE + 'px';
    this._container.textContent = '';
  }

  get length(): number {
    return this._lines.length;
  }

  get width(): number {
    return this._container.offsetWidth;
  }

  addLine(line: Line) {
    this._lines.push(line);
  }

  removeLine(line: Line) {
    let i = this._lines.indexOf(line);
    if (i > -1) {
      this._lines.splice(i, 1);
    }
  }

  resetHtml() {
    this._lines.forEach(line => {
      line.resetHtml();
    });
  }

  render() {
    let lines = this._lines;
    let lineCount = lines.length;
    if (lineCount === 0) {
      return;
    }
    let containerWidth = this._container.offsetWidth;
    lines.forEach((line, index) => {
      line.render();
      let el = line.element;
      this._container.appendChild(el);
      let fontSize = consts.BASE_FONT_SIZE * containerWidth / line.width;
      el.style.lineHeight = fontSize * 1.15 + 'px';
      el.style.fontSize = fontSize + 'px';
      el.style.zIndex = (lineCount - index).toString();
      let s = containerWidth / line.width;
      if (s !== 1) {
        let w = line.width;
        let h = line.height;
        let tx = s * (containerWidth - w) * 0.5;
        let ty = h - s * h;
        el.style.transform = `matrix(${s}, 0, 0, ${s}, ${tx}, ${ty}`;
      }
      el.classList.remove('inline');
    });
  }

  mergeLines(line: Line, prevLine: Line, nextLine: Line) {
    if (!prevLine) {
      nextLine.prependLine(line);
    } else if (!nextLine) {
      prevLine.appendLine(line);
    } else {
      let lineLen = line.length;
      if (lineLen === 1) {
        if (prevLine.length < nextLine.length) {
          prevLine.appendLine(line);
        } else {
          nextLine.prependLine(line);
        }
      } else {
        let i = 0;
        let j = lineLen - 1;
        while (i <= j) {
          if (prevLine.charLength < nextLine.charLength) {
            prevLine.appendWord(line.getWordAt(i++));
          } else if (nextLine.charLength < prevLine.charLength) {
            nextLine.prependWord(line.getWordAt(j--));
          } else {
            let wi = line.getWordAt(i);
            let wj = line.getWordAt(j);
            if (i === j) {
              prevLine.appendWord(wi);
              i++;
            } else {
              prevLine.appendWord(wi);
              nextLine.prependWord(wj);
              i++;
              j--;
            }
          }
        }
      }
    }
    this.removeLine(line);
  }

  optimize() {
    this._lines.forEach((line: Line, index: number) => {
      if (line.charLength < consts.MIN_LINE_LENGTH) {
        this.mergeLines(line, this._lines[index - 1], this._lines[index + 1]);
      }
    });
  }

  toString(): string {
    let ret = '';
    this._lines.forEach(line => {
      ret += line.toString() + '\n';
    });
    return ret;
  }
}

export class Line {
  /**
   * Creates and returns container element for tweet line.
   */
  static createLine(): HTMLElement {
    let el = dom.createNode('div');
    el.setAttribute('class', 'line inline');
    return el;
  }

  private _words: Word[];
  private _element: HTMLElement;

  constructor() {
    this._words = [];
    this._element = Line.createLine();
  }

  get words(): Word[] {
    return this._words;
  }

  get length(): number {
    return this._words.length;
  }

  get width(): number {
    return this._element.offsetWidth;
  }

  get height(): number {
    return this._element.offsetHeight;
  }

  get charLength(): number {
    let ret = 0;
    this._words.forEach(word => {
      ret += word.length;
    });
    return ret;
  }

  get element(): HTMLElement {
    return this._element;
  }

  getWordAt(index: number): Word {
    return this._words[index];
  }

  appendWord(word: Word) {
    if (!word) {
      throw new Error('Word has to be defined');
    }
    this._words.push(word);
  }

  prependWord(word: Word) {
    if (!word) {
      throw new Error('Word has to be defined');
    }
    this._words.unshift(word);
  }

  appendLine(line: Line) {
    line.words.forEach(word => {
      this.appendWord(word);
      line.removeWord(word);
    });
  }

  prependLine(line: Line) {
    let words = line.words;
    let l = line.length - 1;
    for (; l >= 0; l--) {
      let word = words[l];
      this.prependWord(word);
      line.removeWord(word);
    }
  }

  removeWord(word: Word) {
    let i = this._words.indexOf(word);
    if (i > -1) {
      this._words.splice(i, 1);
    }
  }

  render() {
    let el = this._element.firstChild;
    while (el) {
      this._element.removeChild(el);
      el = this._element.firstChild;
    }
    this._words.forEach(word => {
      this._element.appendChild(word.html);
    });
  }

  resetHtml() {
    let el = this._element;
    if (!el.classList.contains('inline')) {
      el.classList.add('inline');
    }
    el.style.lineHeight = null;
    el.style.fontSize = null;
    el.style.transform = null;
  }

  toString(): string {
    let ret = '';
    this._words.forEach(word => {
      ret += word.text + ' ';
    });
    return ret;
  }
}
