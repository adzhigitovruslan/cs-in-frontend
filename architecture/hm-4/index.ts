// Функция для удобного создания перегрузок
// Необходимо написать функцию для удобного создания перегрузок на основе аргументов

function overload(funcArray) {
    const dict = {}

    funcArray.forEach(func => {
        if (dict[func.length]) {
            throw new Error('func already exists')
        }

        dict[func.length] = func
    })

    function outputFn(...args) {
        const len = arguments.length

        return dict[len].apply(this, arguments)
    }

    Object.defineProperty(outputFn, 'length', { value: Math.min(...Object.keys(dict).map(key => Number(key))) })

    return outputFn
}

const myFunction = overload([
    () => 100500,
    (a, b) => a + b,
    (a, b, c) => a * b * c
]);

// // 100500
myFunction()

// 3
myFunction(1, 2)

// 24
myFunction(2, 3, 4)


// View для получения элементов из Map/Set по числовому индексу
// Необходимо написать функцию, которая принимает Map/Set объект и возвращает обертку,
// которая может получать значение по числовым индексам

function indexedWrapper(arg) {
    return new Proxy(arg, {
        get(target, prop, receiver) {
            if (Number.isInteger(Number(prop))) {
                let counter = Number(prop)

                for (const elem of target.values()) {
                    if (!counter) return elem
                    counter--
                }
            }
            const result = Reflect.get(target, prop, receiver)

            if (typeof result === 'function') {
                return result.bind(target)
            }

            return result
        }
    })
}

const indexedMap = indexedWrapper(new Map([
    ['key1', 'foo'],
    ['key2', 'bar'],
]));

// true
console.log(indexedMap.get('key1') === indexedMap[0]);

// ReadonlyView объекта

// Необходимо написать функцию, которая принимает некоторый объект и возвращает его замороженную версию.
//     При этом заморозка должна происходить рекурсивно (в глубину). Однако, оригинальный объект по-прежнему можно менять,
//     причем эти изменения должны быть видны и из замороженного объекта.

function readonly(obj) {
    return new Proxy(obj, {
        get(target, prop, receiver) {
            const value = Reflect.get(target, prop, receiver)

            if (value !== null && typeof value === 'object') {
                return readonly(value)
            }

            return value
        },
        set(target, prop, newValue, receiver) {
            return false
        },
        setPrototypeOf() {
            return false
        },
        deleteProperty() {
            return false
        }
    })
}

const obj = {a: 1, b: [1, 2, 3], c: { a: 1 }, mutate() { this.a++; }};

const readonlyObj = readonly(obj);

readonlyObj.a++;

/// true
console.log(readonlyObj.a === 1);

readonlyObj.mutate();

/// true
console.log(readonlyObj.a === 1);

readonlyObj.b.push(10);

// [1, 2, 3]
console.log(readonlyObj.b);

obj.a++;

/// true
console.log(readonlyObj.a === 2);