import Template from './template';
import utils from './utils';
import {TweetData, TweetMedia, TwitterUser} from './tweet.d';
import Text from './text';
import * as consts from './consts';

export default class Tweet {
  /**
   * Creates and returns container element for tweet line.
   */
  static createLine(): Element {
    let el = utils.createNode('div');
    el.setAttribute('class', 'line inline');
    return el;
  }

  private template_: Template;
  private element_: Element;
  private lines_: HTMLElement[];
  private linesContainer_: HTMLElement;
  private text_: Text;

  constructor(private data_: TweetData, private parent_: HTMLElement) {
    this.data_.timestamp = utils.timeAgo(
      utils.fromTwitterDateTime(this.data_.timestamp)
    );
    this.template_ = new Template(this.data_);
    this.element_ = this.createDOM();
    this.linesContainer_ = <HTMLElement>this.element.querySelector('.text');
    this.text_ = new Text(this.data);

    console.log(this.text_.text);
    console.log(this.text_.words);
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
    let el = utils.createNode('div', {
      'class': 'tweet'
    });
    el.innerHTML = this.template_.get();
    this.parent_.style.borderColor = this.data_.profileColor;
    this.parent_.appendChild(el);
    return el;
  }

  renderLines() {
    if (!this.lines_ || !this.lines_.length) {
      return;
    }
    let lines = this.lines_;
    let lineCount = this.lines_.length;
    let containerWidth = this.linesContainer_.offsetWidth;
    lines.forEach((line, index) => {
      line.style.lineHeight =
        line.style.fontSize = consts.BASE_FONT_SIZE * containerWidth / line.offsetWidth + 'px';
      line.style.zIndex = (lineCount - index).toString();
      let s = containerWidth / line.offsetWidth;
      if (s !== 1) {
        let w = line.offsetWidth;
        let h = line.offsetHeight;
        let tx = s * (containerWidth - w) * 0.5;
        let ty = h - s * h;
        line.style.transform = `matrix(${s}, 0, 0, ${s}, ${tx}, ${ty}`;
      }
      line.setAttribute('class', 'line');
    });
  }

  /**
   * Renders text line elements. Tweet element has to be part of the DOM.
   */
  render() {
    /*
    if (this.lines_ && this.lines_.length) {
      this.renderLines();
      return;
    }

    let data = this.data_;
    let linesContainer = this.linesContainer_;
    linesContainer.textContent = '';
    linesContainer.style.fontSize = consts.BASE_FONT_SIZE + 'px';
    let lineStr = '';
    let testStr = '';
    let currLine = Tweet.createLine();
    this.lines_ = [<HTMLElement>currLine];
    linesContainer.appendChild(currLine);
    let wordsArr = text.split(' ');
    let indexer = 0;
    console.log(wordsArr.join(' '));
    for (let i = 0, l = wordsArr.length; i < l; i++) {
      let word = wordsArr[i];
      if (!word) {
        continue;
      }
      console.log(word, indexer, indexer + word.length);
      indexer = indexer + word.length + 1;
      word = utils.limitString(word, this.maxLineLength_);
      testStr = lineStr + ' ' + word;
      testStr = testStr.trim();
      currLine.textContent = testStr;
      let lastWord = i === l - 1;
      if (testStr.length > this.maxLineLength_) {
        if (lineStr.length < this.minLineLength_ || lastWord && word.length < this.minLineLength_) {
          lineStr = testStr;
        } else {
          currLine.textContent = lineStr;
          currLine = Tweet.createLine();
          this.lines_.push(<HTMLElement>currLine);
          linesContainer.appendChild(currLine);
          lineStr = '';
          i--;
          indexer -= word.length - 1;
        }
      } else {
        lineStr = testStr;
      }
    }
    this.renderLines();
    */
  }
}
