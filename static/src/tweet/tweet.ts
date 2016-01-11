import {Word, EntityWord, Entity} from './word';
import {BasicTweet} from '../typings/tweet';
import Template from './template';
import Text from './text';
import * as consts from './consts';
import * as dom from '../utils/dom';
import * as string from '../utils/string';

export default class Tweet {
  /**
   * Creates and returns container element for tweet line.
   */
  static createLine(): Element {
    let el = dom.createNode('div');
    el.setAttribute('class', 'line inline');
    return el;
  }

  private _element: Element;
  private _template: Template;
  private _linesContainer: HTMLElement;
  private _text: Text;
  private _lines: HTMLElement[];

  constructor(private _data: BasicTweet, private _parent: HTMLElement) {
    this._data.timestamp = string.timeAgo(
      string.fromTwitterDateTime(this._data.timestamp)
    );
    this._template = new Template(this._data);
    this._element = this.createDOM();
    this._linesContainer = <HTMLElement>this._element.querySelector('.text');
    this._text = new Text(_data);
    this._lines = [];
  }

  get element(): Element {
    return this._element;
  }

  /**
   * Creates initial Tweet DOM structure.
   */
  createDOM(): Element {
    let el = dom.createNode('div', {
      'class': 'tweet'
    });
    el.innerHTML = this._template.get();
    this._parent.style.borderColor = this._data.profile_color;
    this._parent.appendChild(el);
    return el;
  }

  renderLines() {
    let lines = this._lines;
    let lineCount = lines.length;
    if (lineCount === 0) {
      return;
    }
    let containerWidth = this._linesContainer.offsetWidth;
    lines.forEach((line, index) => {
      let fontSize = consts.BASE_FONT_SIZE * containerWidth / line.offsetWidth + 'px';
      line.style.lineHeight = fontSize;
      line.style.fontSize = fontSize;
      line.style.zIndex = (lineCount - index).toString();
      let s = containerWidth / line.offsetWidth;
      if (s !== 1) {
        let w = line.offsetWidth;
        let h = line.offsetHeight;
        let tx = s * (containerWidth - w) * 0.5;
        let ty = h - s * h;
        line.style.transform = `matrix(${s}, 0, 0, ${s}, ${tx}, ${ty}`;
      }
      line.classList.remove('inline');
    });
  }

  resetLines() {
    this._lines.forEach(line => {
      if (!line.classList.contains('inline')) {
        line.classList.add('inline');
      }
      line.style.lineHeight = null;
      line.style.fontSize = null;
      line.style.transform = null;
    });
  }

  parseLines() {
    let linesContainer = this._linesContainer;
    linesContainer.textContent = '';
    linesContainer.style.fontSize = consts.BASE_FONT_SIZE + 'px';
    let lineStr = '';
    let testStr = '';
    let currLine = <HTMLElement>Tweet.createLine();
    linesContainer.appendChild(currLine);
    this._lines = [currLine];
    for (let i = 0, l = this._text.words.length; i < l; i++) {
      let word = this._text.words[i];
      if (word instanceof EntityWord && (<EntityWord>word).entity === Entity.Media) {
        continue;
      }
      let wordText = word.text;
      let wordHtml = word.html;
      testStr = lineStr + wordText;
      testStr = testStr.trim();
      currLine.appendChild(wordHtml);
      let lastWord = i === l - 1;
      if (testStr.length > consts.MAX_LINE_LENGTH) {
        if (lineStr.length < consts.MIN_LINE_LENGTH ||
            lastWord && wordText.length < consts.MIN_LINE_LENGTH) {
          lineStr = testStr;
        } else {
          currLine.removeChild(wordHtml);
          currLine = <HTMLElement>Tweet.createLine();
          linesContainer.appendChild(currLine);
          this._lines.push(currLine);
          lineStr = '';
          i--;
        }
      } else {
        lineStr = testStr;
      }
    }
  }

  render() {
    if (this._lines.length == 0) {
      this.parseLines();
    } else {
      this.resetLines();
    }
    this.renderLines();
  }
}
