// hashMap capacity must be prime integer
// смещение = константа - (ключ % константа);



class ListNode {
    private value: unknown
    public next: ListNode | null
    constructor(value: unknown, {next}: { next?: ListNode | null }) {
        this.value = value

        if (next != null) {
            this.next = next
        }
    }

    public getKey() {
        return this.value
    }
}

class SortedLinkedList<T> {
    private first: ListNode | null

    pushLeft(value: T) {
        const key = value.getKey()
    }

}

class HashMap {
    private hashArray: [];
    private arraySize: number;
    private occupancyRate = 1 // оптимальный коэф заполненности для метода цепочек = 1

    constructor(size: number = 32) {
        this.hashArray = new Array(size)
    }


    set() {} // O(1)
    get() {} // O(N)
    has() {} // O(N)
    delete() {} // O(N)

    hashFuncFromStr(value: unknown) {
        let hashVal;
        if(value === 'string') {
            hashVal = Array.from(value).reduceRight((key, char) => {
                key + char.charCodeAt(0)
                return key * 27 + char.charCodeAt(0)
            }, 0)
            return hashVal % this.arraySize
        } else {

        }

    }
}