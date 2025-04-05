// ## Необходимо КА, который считывает дробные числа из потока входных данных
// Если поток данных иссяк, то КА должен выбрасывать исключение и переходить в состояние ожидания новых данных.

interface StateMachine<T, N> {
    [Symbol.iterator](): StateMachine<T, N>;
    next(data?: N): IteratorResult<T>
}
const enum IterData {
    EXPECT_DATA = 'EXPECT_DATA',
    ITER = 'ITER',
}
const numbers = getNumbersGen('100 -2.4 +0.1e-10');
while (true) {
    const cur = numbers.next();
    if (cur.value!.state === IterData.EXPECT_DATA) {
        numbers.next('100 -2.4 +0.1e-10')
    } else {
        console.log(cur.value)
    }
}

function getNumbers(data: string): StateMachine<string | undefined, string> {
    const rgxp = /(?<sign>[+-]?)(?<int>0|[^0]\d*|(?=\.\d+))(?<frac>\.\d*)?(?<exp>[eE][+-]?\d+)?/g

    let state = 'ITER'
    let iter = data.matchAll(rgxp)

    return {
        [Symbol.iterator]() {
            return this
        },

        next(data: string): IteratorResult<string|undefined> {
            if (state === IterData.EXPECT_DATA ) {
                if (data != null) {
                    iter = data.matchAll(rgxp)
                    state = IterData.ITER
                    return { done: false, value: undefined }
                }
                throw state
            }

            const cur = iter.next()

            if (cur.done) {
                state = IterData.EXPECT_DATA
                throw state
            }

            return {
                done: false,
                value: cur.value[0]
            }
        }
    }
}
function* getNumbersGen(data: string) {
    const rgxp = /(?<sign>[+-]?)(?<int>0|[1-9]\d*|(?=\.\d+))(?<frac>\.\d*)?(?<exp>[eE][+-]?\d+)?/g

    let state = 'ITER'
    let iter = data.matchAll(rgxp)

    while (true) {
        if (state === IterData.ITER ) {
            for (const [value] of iter) {
                yield {state, value}
            }
        }

        state = IterData.EXPECT_DATA
        data = yield {state}

        if (data != null) {
            state = IterData.ITER
            iter = data.matchAll(rgxp)
            yield
        }
    }
}