class Result<T, E extends Error> {
    result: T
    error: E
    state: 'fulfilled' | 'rejected'

    constructor(executor: () => T) {
        try {
            this.result = executor();
            this.state = 'fulfilled';
        } catch(e) {
            this.error = e;
            this.state = 'rejected';
        }
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