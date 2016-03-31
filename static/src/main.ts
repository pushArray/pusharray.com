import * as twitter from './data/twitter';
import Card from './layout/card';
import layout from './layout/layout';

const body = document.body;
const tweets = new twitter.Tweets();

function dataHandler() {
  let group = new twitter.Groups(tweets);
  group.data.forEach((cluster: twitter.Group) => {
    let card = new Card(cluster);
    card.render(layout.getNextColumn());
  });
  body.classList.remove('busy');
}

tweets.on(twitter.EVENT_LOADED, dataHandler);
tweets.load();

layout.render(body);
