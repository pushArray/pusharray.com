import {BasicTweet} from '../typings/tweet';

export interface Template {
  create(data: any): string;
  get(): string;
}

export class TweetTemplate implements Template {

  private _template: string = '';

  get(): string {
    return this._template;
  }

  /**
   * Recreates template string with latest {@link Template#data} changes.
   */
  create(data: BasicTweet): string {
    let text = `
      <div class="text"></div>`;
    let user = `
         <div class="user-container">
            <div class="user-image" style="background-image: url(${data.user_image}); background-color: ${data.profile_color};"></div>
            <div class="user">
              <span class="username">${data.username}</span>
              <span class="screen-name">@${data.screen_name}</span>
            </div>
         </div>
         <span class="timestamp" title="${data.fullDate}">${data.shortDate}</span>`;
    let header = '';
    if (data.protected) {
      header = `
        <div class="header">
          ${user}
        </div>`;
    } else {
      header = `
        <a class="header" href="${data.url}" target="_blank">
          ${user}
        </a>`;
    }
    let template = `
      <div class="media"></div>
      ${header}
      ${text}`;

    return this._template = template.trim();
  }
}

export class BoxTemplate implements Template {

  private _template: string = '';

  get(): string {
    return this._template;
  }

  create(): string {
    let template = `
      <div class="tweet-container"></div>
    `;
    return this._template = template;
  }
}
