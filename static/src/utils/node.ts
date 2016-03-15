export default class Node {

  public next: Node;
  public prev: Node;

  insertAfter(newNode: Node) {
    newNode.prev = this;
    newNode.next = this.next;
    this.next = newNode;
  }

  insertBefore(newNode: Node) {
    if (this.prev) {
      this.prev.next = newNode;
    }
    newNode.next = this;
    newNode.prev = this.prev;
    this.prev = newNode;
  }
}
