export const binary = num => {
	const str = new Uint32Array([num])[0].toString(2)
	return '0b' + str.padStart(32, '0').replace(/(.{4})(?!$)/g, '$1_')
}

function parseBinary(str) {
	return parseInt(str.replace(/^0b|_/g, ''), 2) >> 0
}

export const createMask = pos => {
	let r = ~0
	r <<= 32 - len
	r >>>= 32 - pos

	return r
}

export const getLength = numbers => {
	return Math.ceil(Math.log10(Math.abs(numbers)))
}
