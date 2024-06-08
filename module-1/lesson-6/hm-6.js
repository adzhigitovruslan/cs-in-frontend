class Node {
	constructor(value) {
		this.value = value
		this.prev = null
		this.next = null
	}
}

class LinkedList {
	constructor() {
		this.first = null
		this.last = null
	}

	[Symbol.iterator]() {
		let current = this.first
		return {
			next() {
				if (!current) return { value: undefined, done: true }

				let value = current.value
				current = current.next
				return {
					value,
					done: false,
				}
			},
		}
	}

	add(value) {
		const newNode = new Node(value)
		if (!this.first) {
			this.first = newNode
			this.last = newNode
		} else {
			newNode.prev = this.last
			this.last.next = newNode
			this.last = newNode
		}
		return this
	}
	prepend(value) {
		const newNode = new Node(value)
		if (!this.first) {
			this.first = newNode
			this.last = newNode
		} else {
			newNode.next = this.first
			this.first.prev = newNode
			this.first = newNode
		}
		return this
	}
	insert(index, value) {
		if (index === 0) {
			this.prepend(value)
		} else if (index > 0) {
			const newNode = new Node(value)
			let current = this.first
			let i = 0
			while (current && i < index) {
				if (i === index - 1) {
					newNode.next = current.next
					newNode.prev = current
					current.next = newNode
				}
				current = current.next
				i++
			}
		}
		return this
	}
	deleteByIndex(index) {
		let current = this.first
		let i = 0
		while (current) {
			if (i === index) {
				if (current.prev) {
					current.prev.next = current.next
				} else {
					this.first = current.next
				}
				if (current.next) {
					current.next.prev = current.prev
				} else {
					this.last = current.prev
				}
				return this
			}
			i++
			current = current.next
		}
	}
}

const list = new LinkedList(23)
list.add(1)
list.add(2)
list.add(3)
list.add(4)
list.deleteByIndex(1)

console.log(list.first.value) // 1
console.log(list.last.value) // 4
console.log(list.first.next.value) // 3
console.log(list.first.next.prev.value) // 1

for (const value of list) {
	console.log(value) // 1 3 4
}
