import * as twitter from './data/twitter';
import Card from './layout/card';
import Layout from './layout/layout';

const body = document.body;
const layout = new Layout();
layout.render(body);
const collection = new twitter.Tweets();

function collectionHandler(tweets: twitter.Tweet[]): void {
  for (let i = 0; i < tweets.length; i++) {
    let tweet = tweets[i];
    if (!tweet.id) {
      continue;
    }
    let card = new Card(tweet);
    card.render(layout.getNextColumn());
  }
  body.classList.remove('busy');
}

collection.on(twitter.EVENT_LOADED, collectionHandler);
collection.load();
