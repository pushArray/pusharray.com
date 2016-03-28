import {Render} from './render';
import {CardTemplate} from './template';
import Text from './text';
import {Cluster, Tweet} from '../data/twitter';
import * as dom from '../utils/dom';

const doc = document;
const body = doc.body;

export default class Card implements Render {

  static renderText(container: HTMLElement, tweet: Tweet, hsl: number[]) {
    let text = new Text(tweet.text, tweet.entities);
    text.setLinkColor(`hsl(${hsl[0]}, 100%, 50%)`);
    container.style.color = `hsl(${hsl[0]}, 70%, 80%)`;
    text.render(container);
  }

  private _element: HTMLElement;
  private _clusterContainer: HTMLElement;
  private _clusterButton: HTMLElement;

  constructor(private _cluster: Cluster) {
    this._element = this.createHtml();
    this.bodyClickHandler = this.bodyClickHandler.bind(this);
  }

  private createHtml(): HTMLElement {
    let cluster = this._cluster;
    let tweet = cluster.get(0);
    let el =  dom.createNode('li', {'class': 'card'});
    let template = new CardTemplate(tweet);
    el.innerHTML = template.get();

    let hsl = tweet.getColor();
    el.style.color = `hsl(${hsl[0]}, 100%, 50%)`;

    let textContainer = <HTMLElement>dom.query('.text', el);
    Card.renderText(textContainer, tweet, hsl);

    if (cluster.data.length > 1) {
      let clusterButton = <HTMLElement>dom.query('.cluster-button', el);
      clusterButton.addEventListener('click', this.clusterHandler.bind(this), true);
      clusterButton.classList.add('visible');
      clusterButton.textContent = `+${cluster.data.length - 1}`;
      this._clusterButton = clusterButton;
    }

    return el;
  }

  private createCluster(): HTMLElement {
    let el = <HTMLElement>dom.query('.tweets-cluster', this._element);

    let tweets = this._cluster.data;
    let i = 1;
    let l = tweets.length;
    l = l > 10 ? 10 : l;
    let currTimestamp = tweets[0].data.shortDate;
    for (; i < l; i++) {
      let tweet = tweets[i];
      let hsl = tweet.getColor();
      let timestamp = dom.createNode('span', {
        'class': 'timestamp'
      });

      let tweetTimestamp = tweet.data.shortDate;
      if (currTimestamp !== tweetTimestamp) {
        timestamp.textContent = tweetTimestamp;
        el.appendChild(timestamp);
        currTimestamp = tweetTimestamp;
      }

      let text = dom.createNode('div', {
        'class': 'text'
      });
      Card.renderText(text, tweet, hsl);
      el.appendChild(text);
    }

    return el;
  }

  private clusterHandler(event: MouseEvent) {
    event.stopImmediatePropagation();
    event.stopPropagation();

    if (!this._clusterContainer) {
      this._clusterContainer = this.createCluster();
    }

    let el = this._element;
    el.classList.add('focused');
    this._clusterButton.classList.remove('visible');
    this._clusterContainer.classList.add('visible');

    body.addEventListener('click', this.bodyClickHandler);
    el.addEventListener('click', this.elementClickHandler, true);
  }

  private elementClickHandler(event: MouseEvent) {
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  private bodyClickHandler() {
    body.removeEventListener('click', this.bodyClickHandler);
    let el = this._element;
    el.removeEventListener('click', this.elementClickHandler, true);
    el.classList.remove('focused');
    this._clusterButton.classList.add('visible');
    this._clusterContainer.classList.remove('visible');
  }

  render(container: Node): void {
    container.appendChild(this._element);
  }
}
