import {Template, BasicTweet} from './exports';
import sharedTestData from './shared_test_data';

describe('tweet/template.js', () => {
  let tweetData: BasicTweet;

  beforeEach(() => {
    tweetData = sharedTestData.getBasicTweet();
  });

  it('test static method', () => {
    let template = Template.create(tweetData);
    let templateString = template.get();
    expect(templateString).toMatch(tweetData.username);
    expect(templateString).toMatch(tweetData.screen_name);
    expect(templateString).toMatch(tweetData.profile_color);
    expect(templateString).toMatch(tweetData.url);
  });
});
