import * as dom from '../utils/dom';
import * as string from '../utils/string';

export abstract class Word {

  protected html_: HTMLElement;

  constructor(protected text_: string, public startIndex: number, public endIndex: number) {};

  abstract createHtml(): HTMLElement;

  get html() {
    return this.html_;
  }

  get text() {
    return this.text_;
  }
}

export class NormalWord extends  Word {

  constructor(protected text_: string, startIndex: number, endIndex: number) {
    super(text_, startIndex, endIndex);
    this.createHtml();
  }

  createHtml(): HTMLElement {
    this.html_ = dom.createNode('span');
    this.html_.setAttribute('class', 'word');
    this.html_.textContent = string.replaceHtmlEntities(this.text_);
    return this.html;
  }
}

export class UrlWord extends Word {

  constructor(
      protected text_: string,
      public url: string,
      public startIndex: number,
      public endIndex: number
  ) {
    super(text_, startIndex, endIndex);
    this.createHtml();
  }

  createHtml(): HTMLElement {
    this.html_ = dom.createNode('a', {
      href: this.url
    });
    this.html_.setAttribute('class', 'word');
    this.html_.textContent = string.replaceHtmlEntities(this.text_);
    return this.html_;
  }
}

export class MediaWord extends UrlWord {
  constructor(
      protected text_: string,
      public url: string,
      public startIndex: number,
      public endIndex: number
  ) {
    super(text_, url, startIndex, endIndex);
  }
}

export class HashtagWord extends UrlWord {
  constructor(
      protected text_: string,
      public url: string,
      public startIndex: number,
      public endIndex: number
  ) {
    super(text_, url, startIndex, endIndex);
  }
}

export class MentionWord extends UrlWord {
  constructor(
      protected text_: string,
      public url: string,
      public startIndex: number,
      public endIndex: number
  ) {
    super(text_, url, startIndex, endIndex);
  }
}
