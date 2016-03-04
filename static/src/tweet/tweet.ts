import * as consts from './consts';
import {Lines, Line} from './lines';
import Template from './template';
import Text from './text';
import {BasicTweet} from '../typings/tweet';
import * as color from '../utils/color';
import * as dom from '../utils/dom';
import * as string from '../utils/string';
import {Word, EntityWord, Entity} from './word';

export default class Tweet {

  private _element: Element;
  private _template: Template;
  private _text: Text;
  private _lines: Lines;
  private _hslColor: number[];

  constructor(private _data: BasicTweet, private _parent: HTMLElement) {
    this._data.timestamp = string.getShortDate(
      string.fromTwitterDateTime(this._data.timestamp)
    );
    this._template = new Template(this._data);
    this._element = this.createDOM();
    this._text = new Text(_data);
    this._lines = new Lines(<HTMLElement>this._element.querySelector('.line-container'));
    this._hslColor = this.getColor();
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
    let p = this._parent;
    let hsl = this.getColor();
    p.appendChild(el);
    p.style.color = `hsl(${hsl[0]}, 100%, 50%)`;
    return el;
  }

  getColor(): number[] {
    if (this._hslColor) {
      return this._hslColor;
    }
    let c = this._data.profile_color;
    let hex = color.fromHexString(c);
    let rgb = color.hexToRgb(hex);
    return color.rgbToHsl(rgb[0], rgb[1], rgb[2]);
  }

  getMedia(): string {
    let media = this._data.entities.media;
    if (media && media.length) {
      return media[0].media_url;
    }
    return '';
  }

  parseLines() {
    let lines = this._lines;
    let lineStr = '';
    let testStr = '';
    let currLine = new Line();
    lines.addLine(currLine);
    let words = this._text.words;
    for (let i = 0, l = words.length; i < l; i++) {
      let word = words[i];
      if (Word.isEntityWord(word)) {
        let w: EntityWord = <EntityWord>word;
        w.setColor(`hsl(${this._hslColor[0]}, 100%, 80%)`);
        if (w.entity === Entity.Media) {
          continue;
        }
      }
      let wordText = word.text;
      testStr = lineStr + wordText;
      if (testStr.length > consts.MAX_LINE_LENGTH) {
        currLine = new Line();
        currLine.appendWord(word);
        lines.addLine(currLine);
        lineStr = wordText;
      } else {
        lineStr = testStr;
        currLine.appendWord(word);
      }
    }
    lines.optimize();
  }

  render() {
    let lines = this._lines;
    if (lines.length == 0) {
      this.parseLines();
    } else {
      lines.resetHtml();
    }
    lines.render();
  }
}
