import {Group, Tweet} from 'data/twitter';
import Render from 'layout/render';
import {CardTemplate, TweetTemplate} from 'layout/template';
import Text from 'layout/text';
import * as dom from 'utils/dom';
import * as string from 'utils/string';

export default class Card implements Render {

  static MAX_VISIBLE = 5;

  static renderText(container: HTMLElement, tweet: Tweet): Text {
    let text = new Text(tweet.text, tweet.entities);
    text.render(container);
    return text;
  }

  private _element: HTMLElement;

  constructor(private _group: Group) {
    this._element = this.createHtml();
  }

  get element(): HTMLElement {
    return this._element;
  }

  render(container: Node): HTMLElement {
    container.appendChild(this._element);
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
    let isProtected = tweet.data.protected;
    if (isProtected) {
      el.classList.add('protected');
    } else {
      el.style.color = `hsl(${hsl[0]}, 100%, 80%)`;
    }

    let tweetsContainer = <HTMLElement>dom.query('.tweets', el);

    let tweets = group.data;
    let i = 0;
    let l = tweets.length;
    l = l > Card.MAX_VISIBLE ? Card.MAX_VISIBLE : l;
    let currTimestamp = '';
    for (; i < l; i++) {
      let tweet = tweets[i];
      let data = tweet.data;
      let date = string.fromTwitterDateTime(data.timestamp);
      let tweetTimestamp = string.getShortDate(date);

      if (currTimestamp !== tweetTimestamp) {
        let timestamp = dom.createNode('div', {
          'class': 'timestamp',
          'title': string.getFullDate(date)
        });
        timestamp.textContent = tweetTimestamp;
        tweetsContainer.appendChild(timestamp);
        currTimestamp = tweetTimestamp;
      }

      let tweetContainer: HTMLElement;
      if (data.protected) {
        tweetContainer = dom.createNode('div', {
          'class': 'tweet'
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

      let textContainer = <HTMLElement>dom.query('.text', tweetContainer);
      Card.renderText(textContainer, tweet);

      let image = tweet.getMedia();
      if (image) {
        let media = <HTMLElement>dom.query('.media', tweetContainer);
        media.style.backgroundImage = `url(${image})`;
        tweetContainer.classList.add('contains-media');
      }
    }

    return el;
  }
}
