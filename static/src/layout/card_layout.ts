import Card from 'layout/card';
import Layout from 'layout/layout';


export default class CardLayout extends Layout {

  private cards: Card[] = [];

  constructor() {
    super();
  }

  addCard(card: Card): HTMLElement {
    let el = this.renderCard(card);
    this.cards.push(card);
    return el;
  }

  getCardColumn(card: Card): HTMLElement {
    const cols = this._columns;
    const l = cols.length;
    for (let i = 0; i < l; i++) {
      let c = cols[i];
      if (c.contains(card.element)) {
        return c;
      }
    }
    return null;
  }

  resize(): boolean {
    let bool = super.resize();
    if (bool) {
      this.emptyColumns();
      this.cards.forEach(card => {
        this.renderCard(card);
      });
    }
    return bool;
  }

  private renderCard(card: Card): HTMLElement {
    let col = this.getShortestColumn();
    return card.render(col);
  }
}
