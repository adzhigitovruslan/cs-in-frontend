function curry(fn: Function) {
    return function curried(...args: any[]) {
       if (args.length >= fn.length) {
        return fn(...args);
       }

       return function(...args2: any[]) {
        args2.forEach((arg, index) => {
        return curried(...args, ...args2)
       }
    }
}

const diff = curry((a, b) => a - b);

console.log(diff(curry._, 10)(15)); // 5

