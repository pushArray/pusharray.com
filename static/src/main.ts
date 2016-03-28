import * as twitter from './data/twitter';
import Card from './layout/card';
import Layout from './layout/layout';

const body = document.body;
const layout = new Layout();
layout.render(body);
const tweets = new twitter.Tweets();

function dataHandler() {
  let clusters = new twitter.Clusters(tweets);
  clusters.data.forEach((cluster: twitter.Cluster) => {
    let card = new Card(cluster);
    card.render(layout.getNextColumn());
  });
  body.classList.remove('busy');
}

tweets.on(twitter.EVENT_LOADED, dataHandler);
tweets.load();
