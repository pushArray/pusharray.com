export default class Link {

  public next: Link;
  public prev: Link;

  insertAfter(newNode: Link) {
    newNode.prev = this;
    newNode.next = this.next;
    this.next = newNode;
  }

  insertBefore(newNode: Link) {
    if (this.prev) {
      this.prev.next = newNode;
    }
    newNode.next = this;
    newNode.prev = this.prev;
    this.prev = newNode;
  }
}
