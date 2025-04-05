class Foo {
    get42() {
        return 42;
    }
}
class Bar extends Foo {

}

extend(Bar, {
    get overloaded42() {
        return this.get42();
    },

    get42() {
        return super.get42() * 10;
    }
});
function extend(Class, ...mixins) {
    mixins.forEach(mixin => {
        Object.setPrototypeOf(mixin, Object.getPrototypeOf(Class.prototype));
        Object.defineProperties(Class.prototype, Object.getOwnPropertyDescriptors(mixin))
    })
}


class AbstractCache {

}

class LRUCache extends AbstractCache {
    constructor(capacity) {
        super()
        this.capacity = capacity;
        this.cache = new Map()
    }

    get(key) {
        const value = this.cache.get(key);

       if (this.cache.has(key)) {
           this.cache.delete(key)
           this.cache.set(key, value);
       }

       return value
    }

    set(key, value) {
        if (this.capacity === this.cache.size) {
            this.cache.delete(this.cache.keys().next().value);
        }

        this.get(key)

        this.cache.set(key, value);
    }

    delete(key) {
        this.cache.delete(key)
    }

    has(key) {
        if (this.cache.has(key)) {
            this.get(key)

            return true
        }

        return false
    }
}
class NeverCache extends AbstractCache {
    get(key) {
        return undefined
    }
    set(key, value) {}

    delete(key) {}

    has(key) {
        return false
    }
}