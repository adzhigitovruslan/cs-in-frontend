var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var SyncKVStorage = /** @class */ (function () {
    function SyncKVStorage() {
    }
    SyncKVStorage.prototype.get = function (key) {
        return this.storage.get(key);
    };
    SyncKVStorage.prototype.set = function (key, value) {
        return this.storage.set(key, value);
    };
    return SyncKVStorage;
}());
var LocalStorage = /** @class */ (function (_super) {
    __extends(LocalStorage, _super);
    function LocalStorage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return LocalStorage;
}(SyncKVStorage));
var CookieStorage = /** @class */ (function (_super) {
    __extends(CookieStorage, _super);
    function CookieStorage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CookieStorage;
}(SyncKVStorage));
var ls = new LocalStorage();
var cookie = new CookieStorage();
