class Vector {
	#TypedArray
	length = 0
	constructor(TypedArray, { capacity }) {
		this.capacity = capacity
		this.#TypedArray = TypedArray
		this.typedArray = new this.#TypedArray(this.capacity)
		this.buffer = this.typedArray.buffer
	}
	*values() {
		let index = 0
		while (index < this.typedArray.length - 1) {
			yield this.typedArray[index++]
		}
	}
	push(value) {
		if (this.length >= this.capacity) {
			this.capacity *= 2
			const oldBuffer = this.typedArray
			this.typedArray = new this.#TypedArray(this.capacity)
			for (let i = 0; i < oldBuffer.length; i++) {
				this.typedArray[i] = oldBuffer[i]
			}
		}
		this.typedArray[this.length] = value
		this.length++
		return this.length
	}
	pop() {
		if (this.length > 0) {
			this.length--
			return this.typedArray[this.length]
		}
		return
	}
	shrinkToFit() {
		this.capacity = this.length
		const oldBuffer = this.typedArray

		this.typedArray = new this.#TypedArray(this.capacity)

		for (let i = 0; i < this.length; i++) {
			this.typedArray[i] = oldBuffer[i]
		}
		return this.capacity
	}
}

const vec = new Vector(Int8Array, { capacity: 1 })

const i = vec.values()

vec.push(1)
vec.push(2)
vec.push(3)

console.log(i.next()) // {done: false, value: 1}
console.log(i.next()) // {done: false, value: 2}
console.log(i.next()) // {done: false, value: 3}
console.log(i.next()) // {done: true, value: undefined}
console.log(vec) // {done: true, value: undefined}
