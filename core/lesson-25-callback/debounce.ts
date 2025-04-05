function debounce<T extends (...args: any) => any>(fn: T, ms: number) {
    let timeout: NodeJS.Timeout;

    return function(...args: any) {
        return new Promise<T>((resolve, reject) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                    try {
                        resolve(fn.apply(this, args));
                    } catch (error) {
                        reject(error);
                    }
                }, ms);
        })
    }
}

function laugh() {
    console.log('Ha-ha!')
}
  
const debouncedLaugh = debounce(laugh, 300);

debouncedLaugh();
debouncedLaugh();
debouncedLaugh();
debouncedLaugh();
debouncedLaugh(); // Выполнится через 300 мс