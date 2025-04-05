import { binary, getLength } from './helpers.js'

class BCD {
	// Define the size of each packed number
	#allowedBitesSize = 7

	constructor(bigInt) {
		this.numbers = this.#convertBcd(bigInt)
		this.length = 0
	}

	#convertBcd = bigInt => {
		const numberLength = getLength(Number(bigInt))
		let sum = 0
		let i = 0
		let counter = 0
		let packedNums = []
		while (bigInt > 0n) {
			let digit = bigInt % 10n
			bigInt = bigInt / 10n
			sum |= Number(digit) << (i * 4)
			i++
			counter++
			console.log(binary(Number(digit)));
			if ((numberLength - counter) % this.#allowedBitesSize === 0) {
				packedNums.unshift(sum)
				sum = 0
				i = 0
			}
		}
		return packedNums
	}

	#createMask(len, pos) {
		let n = ~0
		n <<= 32 - len
		n >>>= 32 - pos
		return n
	}

	#getBitsLength(arr) {
		let bitLength = 0
		let pointer = false
		for (let i = 0; i < this.#allowedBitesSize; i++) {
			let pos = 28 - i * 4
			let shift = pos - 4
			let bit = (arr & this.#createMask(4, pos)) >>> shift

			if (bit !== 0) pointer = true
			if (pointer) bitLength++
		}
		return bitLength
	}

	#getValueByIndex(arr, index) {
		const bitesPerNumber = 4
		let bitByIndex = 0
		const bitsLength = this.#getBitsLength(arr)
		const pos = 28 - index * 4
		const shift = pos - 4
		if (index < 0) {
		} else {
			bitByIndex = (arr & this.#createMask(4, pos)) >>> shift
		}
		return bitByIndex
	}

	//**TODO: Не реализовано */

	valueOf() {
		for (let i = 0; i < this.numbers.length; i++) {
			let int = this.numbers[i]
			// console.log(binary(int), binary(this.#createMask(4, 4)))
			let lastNumber = 0n
			// while (int > 0n) {
			// 	let digit = BigInt(int) & BigInt(this.#createMask(4, 4))
			// }
		}
		// return result
	}

	//**FIXME: обработать последний индекс(ex. 25 индекс если длина 25 элементов) */
	//**FIXME: отрицательный индекс */

	get(pos) {
		let totalLength = 0
		for (let i = 0; i < this.numbers.length; i++) {
			totalLength += this.#getBitsLength(this.numbers[i])
		}
		if (pos >= 0) pos %= totalLength
		else pos = (pos % totalLength) + totalLength
		let currLength = 0
		for (let i = 0; i < this.numbers.length; i++) {
			let elemLength = this.#getBitsLength(this.numbers[i])
			if (pos < currLength + elemLength) {
				return this.#getValueByIndex(this.numbers[i], pos - currLength)
			}
			currLength += elemLength
		}
	}
}

const n = new BCD(12345678999409424920492094n)
console.log(n.get(26));

// class BCD {
//     protected buffer: number[] = [];

//     protected getMask(i: number): number {
//         const bcdSize = 4;
//         return ~0 << 32 - bcdSize >>> 32 - (i + 1) * bcdSize;
//     }

//     *ranks() {
//         for (const [numI, num] of this.buffer.entries()) {
//             for (let i = 0; i < 8; i++) {
//                 const isSign = numI === this.buffer.length - 1 && i === 7;

//                 if (!isSign) {
//                     yield num & this.getMask(i) >>> i * 4;
//                 }
//             }
//         }
//     }
// }
