interface Stack<T> {
  readonly size: number;
  push(value: string): void;
  pop(): string;
}

type StackNode<T> = {
  readonly value: string;
  readonly next?: StackNode<T>;
};

class StackImpl<T> implements Stack<T> {
  private _size: number = 0;
  private head?: StackNode<T>;

  constructor(private capacity: number = 100) {}

  get size() {
    return this._size;
  }

  push(value: string): void {
    if (this.size === this.capacity)
      throw new Error(`Stack is full: ${this.capacity}`);

    const newNode = { value, next: this.head };
    this.head = newNode;
    this._size++;
  }
  pop(): string {
    if (!this.head) throw new Error('Stack is empty');

    const poppedValue = this.head.value;
    this.head = this.head.next;
    this._size--;
    return poppedValue;
  }
}

const stack = new StackImpl();
stack.push('apple 1');
stack.push('banana 2');
stack.push('cherry 3');
while (stack.size !== 0) {
  console.log(stack.pop());
}

stack.pop();
