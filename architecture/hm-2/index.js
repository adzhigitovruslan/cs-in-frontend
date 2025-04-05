function addToString(array) {
    array.toString = function () {
        if(this.length > 1) return this[0] + '..' + this[array.length - 1];

        return Array.prototype.toString.call(this)
    }
    return array
} // изменяет исходный массив

function addToString1(array) {
    return Object.create(array, {
        toString: {
            configurable: true,
            writable: true,
            value: function () {
                if(this.length > 1) return this[0] + '..' + this[array.length - 1];

                return Array.prototype.toString.call(this)
            }
        }
    })
} // возвращает новый объект с измененным методом

function addToString2(array) {
    return {
        __proto__: array,
        toString() {
            if(this.length > 1) return this[0] + '..' + this[array.length - 1];

            return super.toString()
        }
    }
} // возвращает новый объект с измененным методом

String.prototype.capitalize = function () {
    const segmented = new Intl.Segmenter('en-EN', {granularity: 'word'}).segment(this)
    let result = ''
    for (let {segment} of segmented) {
        result += segment[0].toUpperCase() + segment.slice(1)
    }
    return result
}
console.log('foo bar baz'.capitalize())

