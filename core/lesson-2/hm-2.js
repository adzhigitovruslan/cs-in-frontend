const instructions = {
	'SET A': 0,
	'PRINT A': 1,
	'IFN A': 2,
	RET: 3,
	'DEC A': 4,
	JMP: 5,
}

const program = [
	// Ставим значения аккумулятора
	instructions['SET A'],
	// В 10
	10,

	// Выводим значение на экран
	instructions['PRINT A'],

	// Если A равно 0
	instructions['IFN A'],

	// Программа завершается
	instructions['RET'],

	// И возвращает 0
	0,

	// Уменьшаем A на 1
	instructions['DEC A'],

	// Устанавливаем курсор выполняемой инструкции
	instructions['JMP'],

	// В значение 2
	2,
]

function execute(program) {
	let acc = 0
	let i = 0

	while (program.length) {
		switch (program[i]) {
			case 0:
				acc = program[i + 1]
				i += 2
				break
			case 1:
				console.log(acc)
				i += 1
				break
			case 2:
				acc === 0 ? i++ : (i += 3)
				break
			case 3:
				return program[i + 1]
			case 4:
				acc -= 1
				i += 1
				break
			case 5:
				i = 2
				break
		}
	}
}

// Выведет в консоль
// 10
// 9
// 8
// 7
// 6
// 5
// 4
// 3
// 2
// 1
// 0
// И вернет 0
execute(program)
