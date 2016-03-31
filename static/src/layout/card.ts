import {Render} from './render';
import {CardTemplate} from './template';
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

  constructor(private _cluster: Group) {
    this._element = this.createHtml();
  }

  get cluster(): Group {
    return this._cluster;
  }

  get element(): HTMLElement {
    return this._element;
  }

  private createHtml(): HTMLElement {
    let cluster = this._cluster;
    let tweet = cluster.get(0);
    let el =  dom.createNode('li', {'class': 'card'});
    let template = new CardTemplate(tweet);
    el.innerHTML = template.get();

    let hsl = tweet.getColor();
    el.style.color = `hsl(${hsl[0]}, 100%, 50%)`;

    let textContainer = <HTMLElement>dom.query('.text-container', el);

    let tweets = cluster.data;
    let i = 0;
    let l = tweets.length;
    l = l > 10 ? 10 : l;
    let currTimestamp = tweets[0].data.shortDate;
    for (; i < l; i++) {
      let tweet = tweets[i];
      let hsl = tweet.getColor();
      let timestamp = dom.createNode('div', {
        'class': 'timestamp'
      });

      let tweetTimestamp = tweet.data.shortDate;
      if (currTimestamp !== tweetTimestamp) {
        timestamp.textContent = tweetTimestamp;
        textContainer.appendChild(timestamp);
        currTimestamp = tweetTimestamp;
      }

      let media = tweet.getMedia();
      if (media) {
        let image = dom.createNode('div');
        image.setAttribute('class', 'media');
        image.style.backgroundImage = `url(${media})`;
        textContainer.appendChild(image);
      }

      let text = dom.createNode('div', {
        'class': 'text'
      });
      Card.renderText(text, tweet, hsl);
      textContainer.appendChild(text);
    }

    return el;
  }

  render(container: Node): void {
    container.appendChild(this._element);
  }
}
