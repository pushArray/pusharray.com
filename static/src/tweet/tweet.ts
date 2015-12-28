import Template from './template';
import Text from './text';
import {Word} from './word';
import {
  TweetData,
  TweetMedia
} from './tweet.d';
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

  private template_: Template;
  private element_: Element;
  private linesContainer_: HTMLElement;
  private text_: Text;
  private lines_: HTMLElement[];

  constructor(private data_: TweetData, private parent_: HTMLElement) {
    this.data_.timestamp = string.timeAgo(
      string.fromTwitterDateTime(this.data_.timestamp)
    );
    this.template_ = new Template(this.data_);
    this.element_ = this.createDOM();
    this.linesContainer_ = <HTMLElement>this.element.querySelector('.text');
    this.text_ = new Text(this.data);
    this.lines_ = [];
  }

  get element(): Element {
    return this.element_;
  }

  get data(): TweetData {
    return this.data_;
  }

  /**
   * Creates initial Tweet DOM structure.
   */
  createDOM(): Element {
    let el = dom.createNode('div', {
      'class': 'tweet'
    });
    el.innerHTML = this.template_.get();
    this.parent_.style.borderColor = this.data_.profileColor;
    this.parent_.appendChild(el);
    return el;
  }

  renderLines() {
    let lines = this.lines_;
    let lineCount = lines.length;
    if (lineCount === 0) {
      return;
    }
    let containerWidth = this.linesContainer_.offsetWidth;
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
    this.lines_.forEach(line => {
      if (!line.classList.contains('inline')) {
        line.classList.add('inline');
      }
      line.style.lineHeight = null;
      line.style.fontSize = null;
      line.style.transform = null;
    });
  }

  parseLines() {
    let linesContainer = this.linesContainer_;
    linesContainer.textContent = '';
    linesContainer.style.fontSize = consts.BASE_FONT_SIZE + 'px';
    let lineStr = '';
    let testStr = '';
    let currLine = <HTMLElement>Tweet.createLine();
    linesContainer.appendChild(currLine);
    this.lines_ = [currLine];
    for (let i = 0, l = this.text_.words.length; i < l; i++) {
      let word = this.text_.words[i];
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
          this.lines_.push(currLine);
          lineStr = '';
          i--;
        }
      } else {
        lineStr = testStr;
      }
    }
  }

  render() {
    if (this.lines_.length == 0) {
      this.parseLines();
    } else {
      this.resetLines();
    }
    this.renderLines();
  }
}
