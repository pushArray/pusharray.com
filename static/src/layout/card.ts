import {Render} from './render';
import {CardTemplate} from './template';
import {Tweet} from '../data/twitter';
import Text from './text';
import * as dom from '../utils/dom';

export default class Card implements Render {

  private _element: HTMLElement;

  constructor(private _tweet: Tweet) {
    this._element = this.createHtml();
  }

  private createHtml(): HTMLElement {
    let tweet = this._tweet;
    let el =  dom.createNode('li', {'class': 'card'});
    let template = new CardTemplate(this._tweet);
    el.innerHTML = template.get();

    let hsl = tweet.getColor();
    el.style.color = `hsl(${hsl[0]}, 100%, 50%)`;
    let text = new Text(tweet.text, tweet.entities);
    text.setLinkColor(`hsl(${hsl[0]}, 100%, 50%)`);
    
    let textContainer = <HTMLElement>dom.query('.text', el);
    textContainer.style.color = `hsl(${hsl[0]}, 70%, 80%)`;
    text.render(textContainer);
    
    return el;
  }

  render(container: Node): void {
    container.appendChild(this._element);
  }
}
