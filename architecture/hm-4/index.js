// Функция для удобного создания перегрузок
// Необходимо написать функцию для удобного создания перегрузок на основе аргументов
function overload(funcArray) {
    var dict = {};
    funcArray.forEach(function (func) {
        if (dict[func.length]) {
            throw new Error('func already exists');
        }
        dict[func.length] = func;
    });
    function outputFn() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var len = arguments.length;
        return dict[len].apply(this, arguments);
    }
    Object.defineProperty(outputFn, 'length', { value: Math.min.apply(Math, Object.keys(dict).map(function (key) { return Number(key); })) });
    return outputFn;
}
var myFunction = overload([
    function () { return 100500; },
    function (a, b) { return a + b; },
    function (a, b, c) { return a * b * c; }
]);
// // 100500
myFunction();
// 3
myFunction(1, 2);
// 24
myFunction(2, 3, 4);
// View для получения элементов из Map/Set по числовому индексу
// Необходимо написать функцию, которая принимает Map/Set объект и возвращает обертку,
// которая может получать значение по числовым индексам
function indexedWrapper(arg) {
    return new Proxy(arg, {
        get: function (target, prop, receiver) {
            if (Number.isInteger(Number(prop))) {
                var counter = Number(prop);
                for (var _i = 0, _a = target.values(); _i < _a.length; _i++) {
                    var elem = _a[_i];
                    if (!counter)
                        return elem;
                    counter--;
                }
            }
            var result = Reflect.get(target, prop, receiver);
            if (typeof result === 'function') {
                return result.bind(target);
            }
            return result;
        }
    });
}
var indexedMap = indexedWrapper(new Map([
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
        get: function (target, prop, receiver) {
            var value = Reflect.get(target, prop, receiver);
            if (value !== null && typeof value === 'object') {
                return readonly(value);
            }
            return value;
        },
        set: function (target, prop, newValue, receiver) {
            return false;
        },
        setPrototypeOf: function () {
            return false;
        },
        deleteProperty: function () {
            return false;
        }
    });
}
var obj = { a: 1, b: [1, 2, 3], c: { a: 1 }, mutate: function () { this.a++; } };
var readonlyObj = readonly(obj);
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
