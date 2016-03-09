import {BasicTweet} from '../typings/tweet';

export default class Template {
  /**
   * Returns new instance of {@link Template}.
   */
  static create(data: BasicTweet): Template {
    return new Template(data);
  }

  private _template: string;

  constructor(private _data: BasicTweet) {
    this._template = this.parse();
  }

  get(): string {
    return this._template;
  }

  /**
   * Recreates template string with latest {@link Template#data} changes.
   */
  parse(): string {
    let data = this._data;
    let text = `
      <div class="text">
        <div class="line-container">
          ${data.text}
        </div>
      </div>`;
    let tweetInfo = `
      <div class="username">
            ${data.username}
        </div>
      <span class="timestamp" title="${data.fullDate}">
          ${data.shortDate}
        </span>`;
    let header = '';
    if (data.protected) {
      header = `
        <div class="header">
          ${tweetInfo}
        </div>`;
    } else {
      header = `
        <a class="header" href="${data.url}" target="_blank">
          ${tweetInfo}
        </a>`;
    }
    let template = `
      ${header}
      ${text}`;
    this._template = template.trim();
    return this._template;
  }
}
