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
    constructor(value: T) {
        this.value = value
        this.prev = null
        this.next = null

        return this
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

        this.first = new ListNode(value);
        this.first.next = first

        if (this.last != null) return;

        this.last = this.first
    }

    popLeft(value: T) {
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

        this.last = new ListNode(value);
        this.last.prev = last

        if (this.first != null) return;

        this.first = this.last
    }

    popRight(value: T) {
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
    }

    pushRight(value: T extends BigUint64Array | BigInt64Array ? bigint : number) {
        this.length++;

        let {lastIndex} = this

        if (lastIndex == null) {
            lastIndex = Math.floor(this.capacity / 2)
        } else {
            lastIndex++;

            if (lastIndex > this.capacity - 1) {
                lastIndex = 0
                this.list.pushRight(new this.TypedArray(this.capacity))
            }
        }

        this.lastIndex = lastIndex
        this.list.last.value[lastIndex] = value
    }

    popRight() {
        this.length--;

        let {lastIndex} = this

        if (lastIndex === this.firstIndex && this.list.first === this.list.last) {
            this.firstIndex = null
            this.lastIndex = null
        } else {
            lastIndex--;


        }


    }

    popLeft(value: T extends BigUint64Array | BigInt64Array ? bigint : number) {}
}