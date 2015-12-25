import Template from '../src/template';
import sharedTestData from './shared_test_data';

describe('template.js', () => {
  var tweetData;

  beforeEach(() => {
    tweetData = sharedTestData.getTweetData();
  });

  it('test static method', () => {
    var template = Template.create(tweetData);
    var templateString = template.get();
    expect(templateString).toMatch(tweetData.username);
    expect(templateString).toMatch(tweetData.screenName);
    expect(templateString).toMatch(tweetData.profileColor);
    expect(templateString).toMatch(tweetData.url);
  });
});
