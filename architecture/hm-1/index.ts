interface InnerStorage {
    get(key: string): string
    set(key: string, value: string): any
}

abstract class SyncKVStorage {
    abstract storage: InnerStorage

    get(key: string): any {
        return this.storage.get(key)
    }
    set(key: string, value: string): boolean {
        return this.storage.set(key, value)
    }
}

class LocalStorage extends SyncKVStorage {

}

class CookieStorage extends SyncKVStorage {

}

const ls = new LocalStorage();
const cookie = new CookieStorage();