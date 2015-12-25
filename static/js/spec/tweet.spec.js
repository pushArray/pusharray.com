import Tweet from '../src/tweet';
import sharedTestData from './shared_test_data';

describe('tweet tests', () => {
  var tweet;
  var tweetData;

  beforeEach(() => {
    tweetData = sharedTestData.getTweetData();
    tweet = new Tweet(tweetData, document.body);
  });

  it('check DOM structure', () => {
    var tweetElement = tweet.element;
    var statusUrl = tweetElement.querySelector('a.user-container');
    expect(statusUrl.href).toBe('https://twitter.com/' + tweetData.screenName +
      '/statuses/' + tweetData.id);
    var usernameEl = tweetElement.querySelector('.username');
    expect(usernameEl.textContent.trim()).toBe(tweetData.username);
    var screeNameEl = tweetElement.querySelector('.screenname');
    expect(screeNameEl.textContent.trim()).toBe('@' + tweetData.screenName);
    var textEl = tweetElement.querySelector('.text');
    expect(textEl.textContent.trim()).toBe(tweetData.text);
  });

  it('render tweet', () => {
    tweet.render();
  });
});
