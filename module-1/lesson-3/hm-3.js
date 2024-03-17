function fizzbuzz() {
	let i = 0n
	return {
		next: function () {
			i++
			const fizz = i % 3n === 0n
			const buzz = i % 5n === 0n

			if (fizz && buzz) return 'FizzBuzz'
			if (fizz) return 'Fizz'
			if (buzz) return 'Buzz'

			return i
		},
	}
}

const myFizzBazz = fizzbuzz()

myFizzBazz.next() // 1n
myFizzBazz.next() // 2n
myFizzBazz.next() // Fizz
myFizzBazz.next() // 4n
myFizzBazz.next() // Buzz
myFizzBazz.next() // Fizz
