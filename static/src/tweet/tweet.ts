import {Word, EntityWord, Entity} from './word';
import {Lines, Line} from './lines';
import {BasicTweet} from '../typings/tweet';
import Template from './template';
import Text from './text';
import * as consts from './consts';
import * as dom from '../utils/dom';
import * as string from '../utils/string';

export default class Tweet {

  private _element: Element;
  private _template: Template;
  private _text: Text;
  private _lines: Lines;

  constructor(private _data: BasicTweet, private _parent: HTMLElement) {
    this._data.timestamp = string.timeAgo(
      string.fromTwitterDateTime(this._data.timestamp)
    );
    this._template = new Template(this._data);
    this._element = this.createDOM();
    this._text = new Text(_data);
    this._lines = new Lines(<HTMLElement>this._element.querySelector('.text'));
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
        w.setColor(this._data.profile_color);
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
