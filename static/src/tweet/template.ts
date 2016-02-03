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
    // TODO(@logashoff): Disable link for private profiles.
    let template = `
      <a href="${this._data.url}"
         target="_self"
         class="user-container"
         style="color: ${this._data.profile_color}">
        <div class="user-avatar"
             style="background: ${this._data.profile_color} url(${this._data.user_image});">
        </div>
        <div class="flex-box no-wrap">
            <div class="username">
                ${this._data.username}
            </div>
            <div class="screenname">
                @${this._data.screen_name}
            </div>
            <div class="timestamp">
                ${this._data.timestamp}
            </div>
        </div>
      </a>
      <div class="text">
        <div class="line-container">
          ${this._data.text}
        </div>
      </div>`;
    this._template = template.trim();
    return this._template;
  }
}
