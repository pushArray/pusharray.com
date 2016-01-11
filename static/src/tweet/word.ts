import * as dom from '../utils/dom';
import * as string from '../utils/string';

export abstract class Word {

  protected _html: HTMLElement;

  constructor(protected _text: string, public startIndex: number, public endIndex: number) {};

  abstract createHtml(): HTMLElement;

  get html() {
    return this._html;
  }

  get text() {
    return this._text;
  }
}

export class NormalWord extends Word {

  constructor(_text: string, startIndex: number, endIndex: number) {
    super(_text, startIndex, endIndex);
    this.createHtml();
  }

  createHtml(): HTMLElement {
    this._html = dom.createNode('span');
    this._html.setAttribute('class', 'word');
    this._html.textContent = string.replaceHtmlEntities(this._text);
    return this.html;
  }
}

export enum Entity {Hashtag, Url, Media, UserMention}

export class EntityWord extends Word {

  protected _url: string;
  protected _entity: Entity;

  constructor(text: string, url: string, startIndex: number, endIndex: number, entity: Entity) {
    super(text, startIndex, endIndex);
    this._url = url;
    this._entity = entity;
    this.createHtml();
  }

  get entity(): Entity {
    return this._entity;
  }

  createHtml(): HTMLElement {
    this._html = dom.createNode('a', {
      href: this._url,
      target: '_blank'
    });
    this._html.setAttribute('class', 'word');
    this._html.textContent = string.replaceHtmlEntities(this._text);
    return this._html;
  }
}
