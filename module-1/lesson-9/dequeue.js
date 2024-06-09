"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
Object.defineProperty(exports, "__esModule", { value: true });
var node_assert_1 = require("node:assert");
var ListNode = /** @class */ (function () {
    function ListNode(value) {
        this.value = value;
        this.prev = null;
        this.next = null;
        return this;
    }
    return ListNode;
}());
var LinkedList = /** @class */ (function () {
    function LinkedList() {
    }
    LinkedList.prototype[Symbol.iterator] = function () {
        return this.values();
    };
    LinkedList.prototype.pushLeft = function (value) {
        var first = this.first;
        this.first = new ListNode(value);
        this.first.next = first;
        if (this.last != null)
            return;
        this.last = this.first;
    };
    LinkedList.prototype.popLeft = function () {
        var first = this.first;
        if (this.first == null || this.first === this.last) {
            this.first = null;
            this.last = null;
        }
        else {
            this.first = first.next;
            this.first.prev = null;
        }
        return first === null || first === void 0 ? void 0 : first.value;
    };
    LinkedList.prototype.pushRight = function (value) {
        var last = this.last;
        this.last = new ListNode(value);
        this.last.prev = last;
        if (this.first != null)
            return;
        this.first = this.last;
    };
    LinkedList.prototype.popRight = function () {
        var last = this.last;
        if (this.last == null || this.last === this.first) {
            this.last = null;
            this.first = null;
        }
        else {
            this.last = last.prev;
            this.last.next = null;
        }
        return last === null || last === void 0 ? void 0 : last.value;
    };
    LinkedList.prototype.values = function () {
        var node;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    node = this.first;
                    _a.label = 1;
                case 1:
                    if (!(node != null)) return [3 /*break*/, 3];
                    return [4 /*yield*/, node.value];
                case 2:
                    _a.sent();
                    node = node.next;
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    };
    return LinkedList;
}());
var Dequeue = /** @class */ (function () {
    function Dequeue(TypedArray, capacity) {
        this.length = 0;
        this.firstIndex = null;
        this.lastIndex = null;
        if (capacity <= 0 || capacity % 1 != 0) {
            throw new TypeError('capacity must be a positive number');
        }
        this.capacity = capacity;
        this.TypedArray = TypedArray;
        this.list = new LinkedList();
        this.list.pushLeft(new TypedArray(capacity));
    }
    Dequeue.prototype.pushLeft = function (value) {
        this.length++;
        var firstIndex = this.firstIndex;
        if (firstIndex == null) {
            firstIndex = Math.floor(this.capacity / 2);
        }
        else {
            firstIndex--;
            if (firstIndex < 0) {
                firstIndex = this.capacity - 1;
                this.list.pushLeft(new this.TypedArray(this.capacity));
            }
        }
        this.firstIndex = firstIndex;
        this.list.first.value[firstIndex] = value;
        if (this.lastIndex == null) {
            this.lastIndex = this.firstIndex;
        }
        return this.length;
    };
    Dequeue.prototype.pushRight = function (value) {
        this.length++;
        var lastIndex = this.lastIndex;
        if (lastIndex == null) {
            lastIndex = Math.floor(this.capacity / 2);
        }
        else {
            lastIndex++;
            if (lastIndex >= this.capacity) {
                lastIndex = 0;
                this.list.pushRight(new this.TypedArray(this.capacity));
            }
        }
        this.lastIndex = lastIndex;
        this.list.last.value[lastIndex] = value;
        if (this.firstIndex == null) {
            this.firstIndex = this.lastIndex;
        }
        return this.length;
    };
    Dequeue.prototype.popRight = function () {
        var lastIndex = this.lastIndex;
        if (lastIndex == null) {
            return undefined;
        }
        this.length--;
        var value = this.list.last.value[lastIndex];
        if (lastIndex === this.firstIndex && this.list.first === this.list.last) {
            this.firstIndex = null;
            this.lastIndex = null;
        }
        else {
            lastIndex--;
            if (lastIndex < 0) {
                lastIndex = this.capacity - 1;
                this.list.popRight();
            }
            this.lastIndex = lastIndex;
            if (lastIndex < this.firstIndex && this.list.first === this.list.last) {
                this.firstIndex = lastIndex;
            }
        }
        return value;
    };
    Dequeue.prototype.popLeft = function () {
        var firstIndex = this.firstIndex;
        if (firstIndex == null) {
            return undefined;
        }
        this.length--;
        var value = this.list.first.value[firstIndex];
        if (firstIndex === this.lastIndex && this.list.first === this.list.last) {
            this.firstIndex = null;
            this.lastIndex = null;
        }
        else {
            firstIndex++;
            if (firstIndex > this.capacity - 1) {
                firstIndex = 0;
                this.list.popLeft();
            }
            this.firstIndex = firstIndex;
            if (firstIndex > this.lastIndex && this.list.first === this.list.last) {
                this.lastIndex = firstIndex;
            }
            return value;
        }
    };
    return Dequeue;
}());
var dequeue = new Dequeue(Uint16Array, 3);
(0, node_assert_1.equal)(dequeue.pushLeft(1), 1);
(0, node_assert_1.equal)(dequeue.pushLeft(2), 2);
(0, node_assert_1.equal)(dequeue.pushLeft(3), 3);
(0, node_assert_1.equal)(dequeue.length, 3);
(0, node_assert_1.equal)(dequeue.popLeft(), 3); // Удаляет с начала, возвращает удаленный элемент - 3
(0, node_assert_1.equal)(dequeue.pushLeft(10), 3);
(0, node_assert_1.equal)(dequeue.pushRight(4), 4);
(0, node_assert_1.equal)(dequeue.pushRight(5), 5);
(0, node_assert_1.equal)(dequeue.pushRight(6), 6);
(0, node_assert_1.equal)(dequeue.pushRight(60), 7);
(0, node_assert_1.equal)(dequeue.pushRight(605), 8);
(0, node_assert_1.equal)(dequeue.popRight(), 605);
(0, node_assert_1.equal)(dequeue.pushLeft(1), 8);
(0, node_assert_1.equal)(dequeue.pushLeft(2), 9);
(0, node_assert_1.equal)(dequeue.pushLeft(3), 10);
console.log.apply(console, dequeue.list.values());
console.log(dequeue.list);
