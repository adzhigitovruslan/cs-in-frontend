import {equal} from "node:assert"

type DequeueTypes =
    Uint8Array |
    Uint8ClampedArray |
    Int8Array |
    Uint16Array |
    Uint32Array |
    Int32Array |
    Float32Array |
    Float64Array |
    BigUint64Array |
    BigInt64Array

type TypedArray<T> = new (capacity: number) => T;

class ListNode<T> {
    value: T
    prev: ListNode<T> | null
    next: ListNode<T> | null
    constructor(value: T, {prev, next}: {prev?: ListNode<T> | null, next?: ListNode<T> | null}) {
        this.value = value

        if (prev != null) {
            this.prev = prev
            this.prev.next = this
        }

        if (next != null) {
            this.next = next
            this.next.prev = this
        }
    }
}

class LinkedList<T> {
    first: ListNode<T> | null
    last: ListNode<T> | null

    [Symbol.iterator]() {
        return this.values()
    }

    pushLeft(value: T) {
        const {first} = this

        this.first = new ListNode(value, {next: first});

        if (this.last != null) return;

        this.last = this.first
    }

    popLeft() {
        const {first} = this

        if(this.first == null || this.first === this.last) {
            this.first = null
            this.last = null
        } else {
            this.first = first.next
            this.first.prev = null
        }

        return first?.value
    }

    pushRight(value: T) {
        const {last} = this

        this.last = new ListNode(value, {prev: last});

        if (this.first != null) return;

        this.first = this.last
    }

    popRight() {
        const {last} = this

        if (this.last == null || this.last === this.first) {
            this.last = null
            this.first = null
        } else {
            this.last = last.prev
            this.last.next = null
        }

        return last?.value
    }

    *values() {
        let node = this.first
        while (node != null) {
            yield node.value
            node = node.next
        }
    }
}

class Dequeue<T extends DequeueTypes> {
    length: number = 0
    readonly capacity: number
    readonly TypedArray: TypedArray<T>

    list: LinkedList<T>
    firstIndex: number | null = null
    lastIndex: number | null = null

    constructor(TypedArray: TypedArray<T>, capacity: number) {

        if (capacity <= 0 || capacity % 1 != 0) {
            throw new TypeError('capacity must be a positive number')
        }

        this.capacity = capacity
        this.TypedArray = TypedArray

        this.list = new LinkedList<T>()
        this.list.pushLeft(new TypedArray(capacity))
    }

    pushLeft(value: T extends BigUint64Array | BigInt64Array ? bigint : number) {
        this.length++;

        let {firstIndex} = this

        if (firstIndex == null) {
            firstIndex = Math.floor(this.capacity / 2)
        } else {
            firstIndex--;

            if (firstIndex < 0) {
                firstIndex = this.capacity - 1;
                this.list.pushLeft(new this.TypedArray(this.capacity))
            }
        }

        this.firstIndex = firstIndex
        this.list.first.value[firstIndex] = value

        if (this.lastIndex == null) {
            this.lastIndex = this.firstIndex
        }

        return this.length
    }

    pushRight(value: T extends BigUint64Array | BigInt64Array ? bigint : number) {
        this.length++;

        let {lastIndex} = this

        if (lastIndex == null) {
            lastIndex = Math.floor(this.capacity / 2)
        } else {
            lastIndex++;

            if (lastIndex >= this.capacity) {
                lastIndex = 0
                this.list.pushRight(new this.TypedArray(this.capacity))
            }
        }

        this.lastIndex = lastIndex
        this.list.last.value[lastIndex] = value

        if (this.firstIndex == null) {
            this.firstIndex = this.lastIndex
        }

        return this.length
    }

    popRight(): (T extends BigUint64Array | BigInt64Array ? bigint : number) | undefined {
        let {lastIndex} = this

        if (lastIndex == null) {
            return undefined
        }

        this.length--;
        const value = this.list.last.value[lastIndex]

        if (lastIndex === this.firstIndex && this.list.first === this.list.last) {
            this.firstIndex = null
            this.lastIndex = null
        } else {
            lastIndex--;

            if (lastIndex < 0) {
                lastIndex = this.capacity - 1;
                this.list.popRight()
            }

            this.lastIndex = lastIndex

            if (lastIndex < this.firstIndex && this.list.first === this.list.last) {
                this.firstIndex = lastIndex
            }
        }

            return value as any
    }

    popLeft(): (T extends BigUint64Array | BigInt64Array ? bigint : number) | undefined {
        let {firstIndex} = this
        if(firstIndex == null) {
            return undefined
        }

        this.length--;
        const value = this.list.first.value[firstIndex]

        if (firstIndex === this.lastIndex && this.list.first === this.list.last) {
            this.firstIndex = null
            this.lastIndex = null
        } else {
            firstIndex++;

            if(firstIndex > this.capacity - 1) {
                firstIndex = 0
                this.list.popLeft()
            }

            this.firstIndex = firstIndex

            if (firstIndex > this.lastIndex && this.list.first === this.list.last) {
                this.lastIndex = firstIndex
            }

            return value as any
        }
    }
}

const dequeue = new Dequeue(Uint8Array,  64)

equal(dequeue.pushLeft(1), 1)
equal(dequeue.pushLeft(2), 2)
equal(dequeue.pushLeft(3), 3)

equal(dequeue.length, 3)

equal(dequeue.popLeft(), 3)

equal(dequeue.pushLeft(10), 3)

equal(dequeue.pushRight(4), 4)
equal(dequeue.pushRight(5),5)
equal(dequeue.pushRight(6), 6)
equal(dequeue.pushRight(60), 7)
equal(dequeue.pushRight(255), 8)

equal(dequeue.popRight(), 255)

equal(dequeue.pushLeft(1), 8)
equal(dequeue.pushLeft(2), 9)
equal(dequeue.pushLeft(3), 10)

equal(dequeue.pushRight(255), 11)

console.log(...dequeue.list.values())



