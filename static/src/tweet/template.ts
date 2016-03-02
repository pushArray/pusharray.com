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
      <div class="overlay"></div>
      <div class="text">
        <div class="line-container">
          ${this._data.text}
        </div>
      </div>
      <div class="footer">
        <div class="card">
          <div class="avatar"
               style="background-color: ${this._data.profile_color}; background-image: url(${this._data.user_image})">
          </div>
          <div class="user">
            <div class="username">
                ${this._data.username}
            </div>
            <div class="screenname">
                @${this._data.screen_name}
            </div>
          </div>
        </div>
        <div class="timestamp">
          ${this._data.timestamp}
        </div>
      </div>`;
    this._template = template.trim();
    return this._template;
  }
}
