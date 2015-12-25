import utils from './utils';

export abstract class Word {
  protected html: HTMLElement;
  constructor(protected word_: string, public startIndex: number, public endIndex: number) {};
  abstract createHtml(): HTMLElement;
}

export class NormalWord extends  Word {
  constructor(public word: string, startIndex: number, endIndex: number) {
    super(word, startIndex, endIndex);
    this.createHtml();
  }
  createHtml(): HTMLElement {
    this.html = utils.createNode('span');
    this.html.textContent = this.word_;
    return this.html;
  }
}

export class UrlWord extends Word {
  public html: HTMLElement;
  constructor(public word: string, public url: string, public startIndex: number, public endIndex: number) {
    super(word, startIndex, endIndex);
    this.createHtml();
  }

  createHtml(): HTMLElement {
    this.html = utils.createNode('a', {
      href: this.url
    });
    this.html.textContent = this.word_;
    return this.html;
  }
}

export class MediaWord extends UrlWord {
  constructor(public word: string, url: string, public startIndex: number, public endIndex: number) {
    super(word, url, startIndex, endIndex);
  }
}

export class HashtagWord extends UrlWord {
  constructor(public word: string, url: string, public startIndex: number, public endIndex: number) {
    super(word, url, startIndex, endIndex);
  }
}

export class MentionWord extends UrlWord {
  constructor(public word: string, url: string, public startIndex: number, public endIndex: number) {
    super(word, url, startIndex, endIndex);
  }
}

