import {Group, Groups, Tweet, Tweets} from 'data/twitter';
import Animator from 'layout/animator';
import Card from 'layout/card';
import {CardLayout} from 'layout/layout';
import Render from 'layout/render';

export default class App implements Render {

  private layout: CardLayout = new CardLayout();
  private tweets: Tweets = new Tweets();

  init() {
    const tweets = this.tweets;
    tweets.subscribe(this.dataHandler.bind(this));
    tweets.load();

    window.addEventListener('resize', () => {
      this.layout.resize();
    });
  }

  render(container: Node) {
    this.layout.render(container);
  }

  private dataHandler(data: Tweet[]) {
    const groups = new Groups(data);
    const rowDelays: number[] = [];
    const layout = this.layout;
    let group: Group;
    while (group = groups.next()) {
      const card = new Card(group);
      const el = layout.addCard(card);

      const col = layout.getCardColumn(card);
      const colIndex = layout.getColumnIndex(col);
      const delay = rowDelays[colIndex] || 0;
      rowDelays[colIndex] = delay + 1;

      const animator = new Animator(el);
      animator.animate((delay + colIndex) * 0.075);
    }
  }
}
