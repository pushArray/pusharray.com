import {TweetTemplate, BoxTemplate} from './template';
import {BasicTweet} from '../typings/tweet.d';
import Tweet from './tweet';
import * as dom from '../utils/dom';
import '../typings/promise.d.ts';

export default class Box {

  static create(data: BasicTweet): Box {
    let tweet: Tweet = new Tweet(data, new TweetTemplate());
    return new Box(tweet);
  }

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
    this._tweet.render();
    let hsl = this._tweet.getColor();
    el.style.color = `hsl(${hsl[0]}, 100%, 50%)`;
    return this._element = el;
  }
}
