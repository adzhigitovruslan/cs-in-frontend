
const randomInt = random(0, 100)

function random(min: number, max: number): IterableIterator<number> {
    return {
        [Symbol.iterator]() {
            return this
        },
        next() {
            return {
                done: false,
                value: Math.floor(Math.random() * (max - min + 1))
            }
        }
    }
}

// console.log(randomInt.next())

function take(iter: Iterable<number>, limit: number): IterableIterator<number> {
    const i = iter[Symbol.iterator]()
    let total = 0

    return {
        [Symbol.iterator]() {
            return this
        },
        next() {
            if (total >= limit) {
                return {
                    done: true,
                    value: undefined
                }
            }

            total++
            return i.next()
        }
    }
}

// console.log([...take(randomInt, 15)]);
const a = take(randomInt, 2)
// console.log(a.next())
// console.log(a.next())
// console.log(a.next())

function filter(iter: Iterable<T>, cb: (el: T) => boolean) {
    const i = iter[Symbol.iterator]()

    return {
        [Symbol.iterator]() {
            return this
        },
        next() {
            let nextVal = i.next()
            while (!nextVal.done && !cb(nextVal.value)) {
                nextVal = i.next()
            }
            return nextVal
        }
    }
}

// console.log([...take(filter(randomInt, (el) => el > 30), 5)]);

function enumerate(iter: Iterable<T>) {
    const i = iter[Symbol.iterator]()
    let index = 0
    return {
        [Symbol.iterator]() {
            return this;
        },

        next() {
            index++
            return {
                done: false,
                value: [index, i.next().value]
            }
        }
    }
}

// console.log([...take(enumerate(randomInt), 3)]); // [[0, ...], [1, ...], [2, ...]]

class Ranges {
    start: number
    end: number
    isString: boolean

    constructor(start: number | string, end: number | string) {
        this.isString = typeof start === 'string'
        this.start = typeof start === 'string' ? start.charCodeAt(0) : start
            this.end = typeof end === 'string' ? end.charCodeAt(0) : end
    }

    [Symbol.iterator]() {
        let current = this.start
        return {
            next: () => {
                if (current > this.end) return {done:true,value:undefined}
                return {
                    done: false,
                    value: this.isString ? String.fromCharCode(current++) : current++
                }
            }
        }
    }

    reverse(): IterableIterator<T> {
        let current = this.end

        return {
            [Symbol.iterator]() {
                return this
            },
            next: () => {
                if (current < this.start) return { done: true, value: undefined }
                return {
                    done: false,
                    value: this.isString ? String.fromCharCode(current--) : current--
                }
            }
        }
    }
}

const symbolRange = new Ranges('a', 'f');

// console.log(Array.from(symbolRange)); // ['a', 'b', 'c', 'd', 'e', 'f']

const numberRange = new Ranges(-5, 1);

// console.log(Array.from(numberRange.reverse())); // [1, 0, -1, -2, -3, -4, -5]

function seq(...iters) {
    let cursor = 0
    let i = iters.map(el => el[Symbol.iterator]())

    return {
        [Symbol.iterator]() { return this },
        next() {
            while (cursor < i.length) {
                let cur = i[cursor].next()
                if (cur.done) {
                    cursor++
                } else {
                    return cur
                }
            }

            return {
                done: true,
                value: undefined
            }
        }
    }
}

console.log(...seq([1, 2], new Set([3, 4]), 'bla')); // 1, 2, 3, 4, 'b', 'l', 'a'

function zip(...iters) {
    let iterators = iters.map(iter => iter[Symbol.iterator]());
    let done = false

    return {
        [Symbol.iterator]() { return this; },
        next() {
            let values = new Array(iterators.length)
            if (done) {
                return { done: true, value: undefined };
            }

            for (const [i, iter] of iterators.entries()) {
                const el = iter.next()

                if (el.done) {
                    done = true
                    return { done: true, value: undefined };
                }
                values[i] = el.value
            }

            return { done: false, value: values };
        }
    };
}

console.log(...zip([1, 2], new Set([3, 4]), 'bl')); // [[1, 3, b], [2, 4, 'l']]

function mapSeq(iterable, itersFn) {
    const i = iterable[Symbol.iterator]()
    return {
        [Symbol.iterator]() { return this },
        next() {
            let el = i.next()
            let res = el.value

            if (el.done) { return { done: true, value: undefined }}

            for (const fn of itersFn) {
                res = fn(res)
            }

            return { done: false, value: res }
        }
    }
}

console.log(...mapSeq([1, 2, 3], [(el) => el * 2, (el) => el - 1])); // [1, 3, 5]