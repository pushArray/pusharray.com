export default class Animator {

  constructor(private element: HTMLElement) {
    this.animationEnd = this.animationEnd.bind(this);
  }

  animate(delay = 0) {
    const el = this.element;
    el.addEventListener('animationend', this.animationEnd);
    el.style.animationDelay = delay + 's';
    el.classList.add('animated');
  }

  private animationEnd() {
    const el = this.element;
    el.removeEventListener('animationend', this.animationEnd);
    el.style.animationDelay = null;
    el.classList.remove('animated');
  }

}
