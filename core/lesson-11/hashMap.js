var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var LinkedList = /** @class */ (function () {
    function LinkedList(value) {
        this.next = null;
        this.value = value;
    }
    return LinkedList;
}());
var HashMap = /** @class */ (function () {
    function HashMap(capacity) {
        this.hashLength = 0;
        this.occupancyRate = 0.7;
        this.buffer = new Array(capacity).fill(null);
    }
    HashMap.prototype.getIndex = function (key) {
        var hash;
        switch (typeof key) {
            case 'number':
                hash = hashFnFromNumber(key);
                break;
            case 'string':
                hash = hashFnFromStr(key);
                break;
            case "object":
            case "function":
                hash = hashFnFromObj(key);
                break;
            default:
                hash = hashFnFromStr(String(key));
        }
        return hash % this.buffer.length;
    };
    HashMap.prototype.expandHashMap = function (capacity) {
        if (capacity === void 0) { capacity = this.buffer.length * 2; }
        var entries = __spreadArray([], this.entries(), true);
        this.buffer = new Array(capacity).fill(null);
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var _a = entries_1[_i], key = _a[0], value = _a[1];
            this.set(key, value);
        }
    };
    HashMap.prototype.entries = function () {
        var _i, _a, cell, el;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0, _a = this.buffer;
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    cell = _a[_i];
                    if (cell == null)
                        return [3 /*break*/, 5];
                    el = cell;
                    _b.label = 2;
                case 2: return [4 /*yield*/, el.value];
                case 3:
                    _b.sent();
                    el = el.next;
                    _b.label = 4;
                case 4:
                    if (el != null) return [3 /*break*/, 2];
                    _b.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    };
    HashMap.prototype.entry = function (key) {
        var _this = this;
        var index = this.getIndex(key);
        return {
            get: function () {
                var cell = _this.buffer[index];
                if (cell == null)
                    return undefined;
                var el = cell;
                do {
                    if (el.value[0] == key) {
                        return el.value[1];
                    }
                    el = el.next;
                } while (el != null);
                return undefined;
            },
            set: function (value) {
                if (_this.hashLength / _this.buffer.length > _this.occupancyRate) {
                    _this.expandHashMap();
                }
                var cell = _this.buffer[index];
                if (cell == null) {
                    _this.hashLength++;
                    _this.buffer[index] = new LinkedList([key, value]);
                    return;
                }
                var el = cell;
                while (true) {
                    if (el.value[0] === key) {
                        el.value[1] = value;
                        return;
                    }
                    if (el.next == null) {
                        _this.hashLength++;
                        el.next = new LinkedList([key, value]);
                        return;
                    }
                    el = el.next;
                }
            },
            has: function () {
                var cell = _this.buffer[index];
                if (cell == null)
                    return false;
                var el = cell;
                do {
                    if (el.value[0] === key) {
                        return true;
                    }
                    el = el.next;
                } while (el != null);
                return false;
            },
            delete: function () {
                var cell = _this.buffer[index];
                if (cell == null)
                    return;
                var el = cell;
                var prev = cell;
                do {
                    if (el.value[0] === key) {
                        if (prev === el) {
                            _this.buffer[index] = null;
                        }
                        else {
                            prev.next = el.next;
                        }
                    }
                    prev = el;
                    el = el.next;
                } while (el != null);
            },
        };
    };
    HashMap.prototype.get = function (key) {
        return this.entry(key).get();
    };
    HashMap.prototype.set = function (key, value) {
        this.entry(key).set(value);
    };
    HashMap.prototype.has = function (key) {
        return this.entry(key).has();
    };
    HashMap.prototype.delete = function (key) {
        this.entry(key).delete();
    };
    return HashMap;
}());
var GetObjectHash = Symbol('GetObjectHash');
function hashFnFromObj(obj) {
    if (obj === null)
        return 0;
    if (GetObjectHash in obj) {
        return obj[GetObjectHash];
    }
    var value = Math.random() * 1000 >>> 0;
    Object.defineProperty(obj, GetObjectHash, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: value
    });
    return value;
}
function hashFnFromStr(str) {
    return Array.from(str).reduceRight(function (key, char) {
        return key * 27 + char.charCodeAt(0);
    }, 0);
}
function hashFnFromNumber(num) {
    return num;
}
var map = new HashMap(32);
map.set('foo', 1);
map.set(42, 10);
console.log(map.get(42), map.buffer); // 10
