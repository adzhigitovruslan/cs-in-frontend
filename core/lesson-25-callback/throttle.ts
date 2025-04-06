function throttle<T extends (...args: any) => any>(fn: T, ms: number) {
    let isThrottled = false;
    let savedArgs: any;

    return function (...args: any) {
        return new Promise<T>((resolve, reject) => {
            if (isThrottled) {
                savedArgs = args;
                return;
            }

            isThrottled = true;
            fn.apply(this, args);

            setTimeout(() => {
                isThrottled = false;
                if (savedArgs) {
                    try {
                        resolve(fn.apply(this, savedArgs))
                    } catch (error) {
                        reject(error);
                    } finally {
                        savedArgs = null;
                    }
                }
            }, ms);
        })
    }
}

function laugh() {
    console.log('Ha-ha!')
}

const throttledLaugh = throttle(laugh, 300);

throttledLaugh(); // Выполнится сразу
throttledLaugh();
throttledLaugh();
throttledLaugh();
throttledLaugh(); // Выполнится через 300 мс