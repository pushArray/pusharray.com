import * as consts from './consts';
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
  private _hslColor: number[];

  constructor(private _data: BasicTweet, private _parent: HTMLElement) {
    let date = string.fromTwitterDateTime(_data.timestamp);
    _data.shortDate = string.getShortDate(date);
    _data.fullDate = string.getFullDate(date);
    this._template = new Template(this._data);
    this._element = this.createDOM();
    this._text = new Text(_data, <HTMLElement>this._element.querySelector('.text'));
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
    p.appendChild(el);
    let hsl = this.getColor();
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

  render() {
    let el = this._element;
    let classList = el.classList;
    if (classList.contains('rendered')) {
      classList.remove('rendered');
    }
    classList.add('rendered');
  }
}
