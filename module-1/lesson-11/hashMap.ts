class LinkedList<T> {
    value: T
    next: LinkedList<T> | null = null

    constructor(value: T) {
        this.value = value
    }
}

class HashMap {
    buffer: Array<LinkedList<[unknown, unknown]> | null>
    hashLength: number = 0
    occupancyRate = 0.7

    constructor(capacity: number) {
        this.buffer = new Array(capacity).fill(null)
    }

    private getIndex(key: unknown) {
        let hash;

        switch (typeof key) {
            case 'number':
                hash = hashFnFromNumber(key)
                break;
            case 'string':
                hash = hashFnFromStr(key)
                break;
            case "object":
            case "function":
                hash = hashFnFromObj(key)
                break;
            default:
                hash = hashFnFromStr(String(key))
        }

        return hash % this.buffer.length
    }
    private expandHashMap(capacity: number = this.buffer.length * 2) {
        const entries = [...this.entries()]

        this.buffer = new Array(capacity).fill(null)

        for(const [key, value] of entries) {
            this.set(key, value)
        }
    }

    *entries(): IterableIterator<[unknown, unknown]> {
        for (const cell of this.buffer) {
            if (cell == null) continue

            let el: typeof cell | null = cell

            do {
                yield el.value
                el = el.next
            } while (el != null)
        }
    }
    entry(key: unknown) {
        const index = this.getIndex(key)

        return {
            get: () => {
                const cell = this.buffer[index]
                console.log(index, 'get')
                if (cell == null) return undefined

                let el: typeof cell | null = cell

                do {
                    if (el.value[0] === key) {
                        return el.value[1]
                    }

                    el = el.next

                } while (el != null)

                return undefined
            },
            set: (value: unknown) => {
                if (this.hashLength / this.buffer.length > this.occupancyRate ) {
                    this.expandHashMap()
                }
                console.log(index, 'set')
                const cell = this.buffer[index]

                if (cell == null) {
                    this.hashLength++
                    this.buffer[index] = new LinkedList([key, value])
                    return
                }

                let el: typeof cell = cell

                while (true) {
                    if (el.value[0] === key) {
                        el.value[1] = value
                    return
                    }

                    if(el.next == null) {
                        this.hashLength++
                        el.next = new LinkedList([key, value])
                        return
                    }
                    el = el.next
                }
            },
            has: () => {
                const cell = this.buffer[index]
                if (cell == null) return false

                let el: typeof cell | null = cell

                do {
                    if (el.value[0] === key) {
                        return true
                    }

                    el = el.next
                } while(el != null)

                return false
            },
            delete: () => {
                const cell = this.buffer[index]

                if (cell == null) return

                let el: typeof cell | null = cell
                let prev = cell

                do {
                    if (el.value[0] === key) {
                        if (prev === el) {
                            this.buffer[index] = null
                        } else {
                            prev.next = el.next
                        }
                    }

                    prev = el
                    el = el.next
                } while(el != null)

            },
        }


    }
    get(key: unknown) {
        this.entry(key).get()
    }
    set(key: unknown, value: unknown) {
        this.entry(key).set(value)
    }
    has(key: unknown) {
        this.entry(key).has()
    }
    delete(key: unknown) {
        this.entry(key).delete()
    }
}

const GetObjectHash = Symbol('GetObjectHash')

function hashFnFromObj(obj: object | null): number {
    if (obj === null) return 0

    if (GetObjectHash in obj) {
        return obj[GetObjectHash] as number
    }

    const value = Math.random() * 1000 >>> 0

    Object.defineProperty(obj, GetObjectHash, {
        enumerable: false,
        configurable: false,
        writable: false,
        value
    });

    return value
}
function hashFnFromStr(str: string)  {
    return Array.from(str).reduceRight((key, char) => {
        return key * 27 + char.charCodeAt(0)
    }, 0)
}
function hashFnFromNumber (num: number) {
    return num
}

const map = new HashMap(32)

map.set('foo', 1);
map.set(42, 10);
console.log(map.get(42), map.buffer);          // 10
