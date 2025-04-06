function waterfall(tasks: Iterable<(...args: any[]) => void>, cb: (err: any, ...args: any[]) => void) {
  const iterator = tasks[Symbol.iterator]();
  let newArgs: any[] = [];

  function cbHandler(err: any, ...args: any[]) {
    if (err) {
      cb(err);
      return;
    }

    newArgs = args;
    executor()
  }

  function executor() {
    const { value, done } = iterator.next();

    if (done) {
      cb(null, ...newArgs);
      return;
    }

    value(...newArgs, cbHandler);
  }

  executor();
}


waterfall([
  (cb) => {
    cb(null, 'one', 'two');
  },

  (arg1, arg2, cb) => {
    console.log(arg1); // one
    console.log(arg2); // two
    cb(null, 'three');
  },

  (arg1, cb) => {
    console.log(arg1); // three
    cb(null, 'done');
  }
], (err, result) => {
  console.log(result); // done
});

waterfall(new Set([
  (cb) => {
    cb('ha-ha!');
  },

  (arg1, cb) => {
    cb(null, 'done');
  }
]), (err, result) => {
  console.log(err);    // ha-ha!
  console.log(result); // undefined
});