import {Groups, Tweets, Tweet} from 'data/twitter';
import Card from 'layout/card';
import Layout from 'layout/layout';

const body = document.body;
const cards: Card[] = [];

const layout = new Layout();
layout.render(body);
layout.on(Layout.COLUMN_CHANGE, () => {
  layout.emptyColumns();
  cards.forEach(card => {
    let col = layout.getShortestColumn();
    card.render(col);
  });
});

window.addEventListener('resize', () => {
  layout.resize();
});

function cardAnimationComplete(e: AnimationEvent) {
  let el = <HTMLElement>e.target;
  el.removeEventListener('animationend', cardAnimationComplete);
  el.style.animationDelay = null;
  el.classList.remove('animated');
}

function animateCard(el: HTMLElement, delay = 0) {
  el.addEventListener('animationend', cardAnimationComplete);
  el.style.animationDelay = delay + 's';
  el.classList.add('animated');
}

function nextHandler(data: Tweet[]) {
  let groups = new Groups(data);
  let rowDelays: number[] = [];
  groups.data.forEach(group => {
    let card = new Card(group);
    cards.push(card);
    let col = layout.getShortestColumn();
    let el = card.render(col);
    let colIndex = layout.getColumnIndex(col);
    let delay = rowDelays[colIndex] || 0;
    rowDelays[colIndex] = delay + 1;
    animateCard(el, (delay + colIndex) * 0.075);
  });
  body.classList.remove('busy');
}

const tweets = new Tweets();
tweets.load().subscribe(nextHandler);
