import {BoxTemplate} from './template';
import Tweet from './tweet';
import * as dom from '../utils/dom';

export default class Box {

  private _element: HTMLElement;

  constructor(private _tweet: Tweet) {
    this._element = this.createHtml();
  }

  get element(): HTMLElement {
    return this._element;
  }

  private createHtml(): HTMLElement {
    let el =  dom.createNode('li', {'class': 'box'});
    el.innerHTML = new BoxTemplate().create();
    let tweetContainer = <HTMLElement>dom.query('.tweet-container', el);
    tweetContainer.appendChild(this._tweet.element);
    let hsl = this._tweet.getColor();
    el.style.color = `hsl(${hsl[0]}, 100%, 50%)`;
    return this._element = el;
  }
}
