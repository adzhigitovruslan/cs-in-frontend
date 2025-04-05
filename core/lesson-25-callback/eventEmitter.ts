class EventEmitter {
    private events: Map<string, Map<Function, {once: boolean}>> = new Map();

    on(event: string, callback: Function) {
        if (!this.events.has(event)) {
            this.events.set(event, new Map());
        }

        this.events.get(event).set(callback, {once: false});
    }

    once(event: string, callback: Function) {
        if (!this.events.has(event)) {
            this.events.set(event, new Map());
        }

        this.events.get(event).set(callback, {once: true});
    }

    off(event?: string, callback?: Function): void {
        if (!event || !callback) {
            this.events.clear();
            return;
        }

        if (event) {
            this.events.delete(event);
            return;
        }

        if (!this.events.has(event)) {
            return;
        }

        this.events.get(event).delete(callback);
    }

    emit(event: string, ...args: any[]) {
        this.events.get(event)?.forEach((desc, cb) => {
            cb(...args);

            if (desc.once) {
                this.off(event, cb);
            }
        })
    }
}

const ee = new EventEmitter();

ee.once('fooOnce', console.log); // Сработает только один раз
ee.on('foo', console.log)

ee.emit('fooOnce', 1);
ee.emit('fooOnce', 2);
ee.emit('foo', 'foo');
ee.emit('foo', 'foo');

ee.off('foo', console.log); // Отмена конкретного обработчика события по ссылке
ee.off('foo');              // Отмена всех обработчиков этого события