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
    let userContent = `
      <div class="avatar"
           style="background-color: ${data.profile_color}; background-image: url(${data.user_image})">
      </div>
      <div class="user">
        <div class="username">
            ${data.username}
        </div>
        <div class="screenname">
            @${data.screen_name} <span class="timestamp" title="${data.fullDate}">${data.shortDate}</span>
        </div>
      </div>`;
    let user = '';
    if (data.protected) {
      user = `
        <div class="card">
          ${userContent}
        </div>`;
    } else {
      user = `
        <a class="card" href="${data.url}" target="_blank">
          ${userContent}
        </a>`;
    }
    let template = `
      <div class="header">
        ${user}
      </div>
      ${text}`;
    this._template = template.trim();
    return this._template;
  }
}
