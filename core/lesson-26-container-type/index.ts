class Result<T, E extends Error> {
    result: T
    error: E
    state: 'fulfilled' | 'rejected'

    constructor(executor: () => T) {
        try {
            this.result = executor();
            this.state = 'fulfilled';
        } catch (e) {
            this.error = e;
            this.state = 'rejected';
        }
    }

    static resolve<T, E extends Error>(value: T | Result<T, E>): Result<T, E> {
        return value instanceof Result ? value : new Result(() => value);
    }

    then(cb: (data: T) => void) {
        if (this.state === 'fulfilled') {
            cb(this.result);
        }

        return this;
    }
    catch(cb: (err: E) => void) {
        if (this.state === 'rejected') {
            cb(this.error);
        }

        return this;
    }
}

const res1 = new Result(() => 42);

res1.then((data) => {
    console.log(data);
});

const res2 = new Result(() => { throw 'Boom!'; });

res1.then((data) => {
    // Этот callback не вызовется
    console.log(data);

    // А этот вызовется
}).catch(console.error);

function exec(gen: () => Generator<Result<any, any>>) {
    const iterator = gen();
    let data: any;
    let returnValue: any;

    while (true) {
        if (returnValue) return returnValue;

        const { value, done } = iterator.next(data);
        const resolved = Result.resolve(value);

        if (done) return resolved;

        resolved.then((value) => {
            data = value;
        }).catch((err) => {
            returnValue = new Result(() => { throw err; });
        });
    }
}

exec(function* main() {
    const res1 = new Result(() => 42);
    console.log(yield res1);

    try {
        const res2 = yield new Result(() => { throw 'Boom!'; });

    } catch (err) {
        console.error(err);
    }
});