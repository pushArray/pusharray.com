import {TweetData} from './tweet.d';

export default class Template {
  /**
   * Returns new instance of {@link Template}.
   */
  static create(data: TweetData): Template {
    return new Template(data);
  }

  private template_: string;

  constructor(private data_: TweetData) {
    this.template_ = this.parse();
  }

  /**
   * Returns previously parsed string.
   */
  get(): string {
    return this.template_;
  }

  /**
   * Recreates template string with latest {@link Template#data} changes.
   */
  parse(): string {
    let template = `
      <a href="${this.data_.url}"
         target="_self"
         class="user-container"
         style="color: ${this.data_.profileColor}">
        <div class="user-avatar"
             style="background: ${this.data_.profileColor} url(${this.data_.userImage});">
        </div>
        <div class="flex-box no-wrap">
            <div class="username">
                ${this.data_.username}
            </div>
            <div class="screenname">
                @${this.data_.screenName}
            </div>
            <div class="timestamp">
                ${this.data_.timestamp}
            </div>
        </div>
      </a>
      <div class="text">
        ${this.data_.text}
      </div>`;
    this.template_ = template.trim();
    return this.template_;
  }
}
