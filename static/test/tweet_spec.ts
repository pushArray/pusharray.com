import {Tweet, BasicTweet} from './exports';
import sharedTestData from './shared_test_data';

describe('tweet/tweet.ts', () => {
  let tweet: Tweet;
  let basicTweet: BasicTweet;

  beforeEach(() => {
    basicTweet = sharedTestData.getBasicTweet();
    tweet = new Tweet(basicTweet, document.body);
  });

  it('check DOM structure', () => {
    let tweetElement = tweet.element;
    let statusUrl = <HTMLLinkElement>tweetElement.querySelector('a.user-container');
    let linkUrl = `https://twitter.com/${basicTweet.screen_name}/statuses/${basicTweet.id}`;
    expect(statusUrl.href).toBe(linkUrl);
    let usernameEl = tweetElement.querySelector('.username');
    expect(usernameEl.textContent.trim()).toBe(basicTweet.username);
    let screeNameEl = tweetElement.querySelector('.screenname');
    expect(screeNameEl.textContent.trim()).toBe('@' + basicTweet.screen_name);
    let textEl = tweetElement.querySelector('.text');
    expect(textEl.textContent.trim()).toBe(basicTweet.text);
  });

  it('render tweet', () => {
    tweet.render();
  });
});
