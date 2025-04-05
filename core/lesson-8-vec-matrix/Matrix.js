
class Matrix {
	constructor(typedArray, ...axes) {
		if (axes.length < 2)
			throw new Error('length of axes must be greater than or equal 2')
		this.axes = axes
		this.capacity = this.axes.reduce((multiplication, coord) => {
			if (typeof coord !== 'number')
				throw new TypeError('coordinates must be numbers')
			return multiplication * coord
		}, 1)
		this.bytesPerElement = typedArray.BYTES_PER_ELEMENT
		this.buffer = new ArrayBuffer(this.capacity * this.bytesPerElement)
		this.typedArray = new typedArray(this.buffer)
	}

	set(value, ...coordinates) {
		this.typedArray[this.#getIndex(coordinates)] = value
	}
	get(...coordinates) {
		return this.typedArray[this.#getIndex(coordinates)]
	}
	#getIndex(coordinates) {
		let [x, y, ...other] = [this.axes[1], this.axes[0], this.axes.slice(2)]

		return coordinates.reduce((acc, coord, i) => {
			if (typeof coord !== 'number')
				throw new TypeError('coordinates must be numbers')
			return (acc += coord * Math.pow([x, y, ...other][i], i))
		}, 0)
	}
	*values() {
		for (let i = 0; i < this.typedArray.length; i++) {
			yield this.typedArray[i]
		}
	}
}

const matrix3n4n5 = new Matrix(Int8Array, 2, 2, 2)

//matrix3n4n5.set(VALUE, COLUMN, ROW, ...)
matrix3n4n5.set(1, 0, 0, 0)
matrix3n4n5.set(2, 1, 0, 0)

matrix3n4n5.set(3, 0, 1, 0)
matrix3n4n5.set(4, 1, 1, 0)

matrix3n4n5.set(5, 0, 0, 1)
matrix3n4n5.set(6, 1, 0, 1)

matrix3n4n5.set(7, 0, 1, 1)
matrix3n4n5.set(8, 1, 1, 1)

// array buffer -> [1 2 3 4 5 6 7 8]

matrix3n4n5.get(0, 0, 0) // 1
matrix3n4n5.get(1, 0, 0) // 2

matrix3n4n5.get(0, 1, 0) // 3
matrix3n4n5.get(1, 1, 0) // 4

matrix3n4n5.get(0, 0, 1) // 5
matrix3n4n5.get(1, 0, 1) // 6

matrix3n4n5.get(0, 1, 1) // 7
matrix3n4n5.get(1, 1, 1) // 8

matrix3n4n5.buffer
// buffer: ArrayBuffer {
//     [Uint8Contents]: <01 02 03 04 05 06 07 08>,
//     byteLength: 8
//   }

// [1, 2, 3, 4, 5, 6, 7, 8]
console.log(Array.from(matrix3n4n5.values()))
