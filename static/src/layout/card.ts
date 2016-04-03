import {Render} from './render';
import {CardTemplate, TweetTemplate} from './template';
import Text from './text';
import {Group, Tweet} from '../data/twitter';
import * as dom from '../utils/dom';

export default class Card implements Render {

  static renderText(container: HTMLElement, tweet: Tweet, hsl: number[]) {
    let text = new Text(tweet.text, tweet.entities);
    text.setLinkColor(`hsl(${hsl[0]}, 100%, 50%)`);
    container.style.color = `hsl(${hsl[0]}, 70%, 80%)`;
    text.render(container);
  }

  private _element: HTMLElement;

  constructor(private _group: Group) {
    this._element = this.createHtml();
  }

  get element(): HTMLElement {
    return this._element;
  }

  private createHtml(): HTMLElement {
    let group = this._group;
    let tweet = group.get(0);
    let el =  dom.createNode('li', {'class': 'card'});
    let cardTemplate = new CardTemplate(tweet);
    el.innerHTML = cardTemplate.get();
    let tweetTemplate = new TweetTemplate();

    let hsl = tweet.getColor();
    el.style.color = `hsl(${hsl[0]}, 100%, 50%)`;

    let tweetsContainer = <HTMLElement>dom.query('.tweets', el);

    let tweets = group.data;
    let i = 0;
    let l = tweets.length;
    l = l > 10 ? 10 : l;
    let currTimestamp = '';
    for (; i < l; i++) {
      let tweet = tweets[i];
      let data = tweet.data;
      let tweetTimestamp = data.shortDate;

      if (currTimestamp !== tweetTimestamp) {
        let timestamp = dom.createNode('div', {
          'class': 'timestamp'
        });
        timestamp.textContent = tweetTimestamp;
        tweetsContainer.appendChild(timestamp);
        currTimestamp = tweetTimestamp;
      }

      let tweetContainer: HTMLElement;
      if (data.protected) {
        tweetContainer = dom.createNode('div', {
          'class': "tweet"
        });
      } else {
        tweetContainer = dom.createNode('a', {
          'class': 'tweet',
          'href': data.url,
          'target': '_blank'
        });
      }
      tweetContainer.innerHTML = tweetTemplate.get();
      tweetsContainer.appendChild(tweetContainer);

      let text = <HTMLElement>dom.query('.text', tweetContainer);
      Card.renderText(text, tweet, hsl);

      let image = tweet.getMedia();
      if (image) {
        let media = <HTMLElement>dom.query('.media', tweetContainer);
        media.style.backgroundImage = `url(${image})`;
        tweetContainer.classList.add('has-media');
      }
    }

    return el;
  }

  render(container: Node): void {
    container.appendChild(this._element);
  }
}
