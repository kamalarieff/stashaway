/* export default class Queue extends Array {
  enqueue(val: any) {
    this.push(val);
  }

  dequeue() {
    return this.shift();
  }

  peek() {
    return this[0];
  }

  isEmpty() {
    return this.length === 0;
  }
} */

/**
 * @class
 * @description
 * This is an implementation of the queue data structure.
 * JavaScript doesn't have a built in so we create one here
 *
 * @example
 * const queue = new Queue([1, 2, 3]);
 * queue.peek();
 * //=> 1
 *
 * queue.dequeue();
 * //=> 1
 *
 * console.log(queue)
 * //=> [2, 3]
 *
 * queue.enqueue(4);
 * //=> [2, 3, 4]
 *
 * queue.isEmpty();
 * //=> false
 *
 * queue.dequeue();
 * queue.dequeue();
 * queue.dequeue();
 * queue.isEmpty();
 * //=> true
 **/
export default class Queue<T> {
  _store: T[] = [];

  constructor(val: T[]) {
    this._store = val;
  }

  enqueue(val: T) {
    this._store.push(val);
  }

  dequeue(): T | undefined {
    return this._store.shift();
  }

  peek() {
    return this._store[0];
  }

  isEmpty() {
    return this._store.length === 0;
  }
}
