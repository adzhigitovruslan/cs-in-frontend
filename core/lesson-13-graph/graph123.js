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
var GraphVis = require('graphviz-node');
var spawn = require('node:child_process').spawn;
var Matrix = /** @class */ (function () {
    function Matrix(TypedArray, rows, cols, data) {
        this.TypedArray = TypedArray;
        this.array = new TypedArray(rows * cols);
        this.rows = rows;
        this.cols = cols;
        if (data != null) {
            this.array.set(data);
        }
    }
    Object.defineProperty(Matrix.prototype, "buffer", {
        get: function () {
            return this.array.buffer;
        },
        enumerable: false,
        configurable: true
    });
    Matrix.prototype.get = function (start, end) {
        return this.array[this.getIndex(start, end)];
    };
    Matrix.prototype.set = function (value, start, end) {
        return this.array[this.getIndex(start, end)] = value;
    };
    Matrix.prototype.clone = function () {
        return new Matrix(this.TypedArray, this.rows, this.cols, this.array);
    };
    Matrix.prototype.getIndex = function (start, end) {
        var _this = this;
        return [start, end].reduce(function (acc, coord, i) { return acc += coord * Math.pow([_this.rows, _this.cols][i], i); });
    };
    Matrix.prototype.byRows = function () {
        var x, y;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    x = 0;
                    _a.label = 1;
                case 1:
                    if (!(x < this.rows)) return [3 /*break*/, 6];
                    y = 0;
                    _a.label = 2;
                case 2:
                    if (!(y < this.cols)) return [3 /*break*/, 5];
                    return [4 /*yield*/, [x, y, this.get(x, y)]];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    y++;
                    return [3 /*break*/, 2];
                case 5:
                    x++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    };
    Matrix.prototype.byCols = function () {
        var y, x;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    y = 0;
                    _a.label = 1;
                case 1:
                    if (!(y < this.cols)) return [3 /*break*/, 6];
                    x = 0;
                    _a.label = 2;
                case 2:
                    if (!(x < this.rows)) return [3 /*break*/, 5];
                    return [4 /*yield*/, [x, y, this.get(x, y)]];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    x++;
                    return [3 /*break*/, 2];
                case 5:
                    y++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    };
    return Matrix;
}());
var Graph = /** @class */ (function () {
    function Graph(matrix) {
        this.adjMat = matrix;
    }
    Graph.prototype.checkAdjacency = function (x, y) {
        return this.adjMat.get(x, y) > 0;
    };
    Graph.prototype.getNodeWeight = function (start, end) {
        return this.adjMat.get(start, end);
    };
    Graph.prototype.createEdge = function (x, y, weight) {
        this.adjMat.set(weight, x, y);
        this.adjMat.set(weight, y, x);
    };
    Graph.prototype.removeEdge = function (x, y) {
        this.removeArc(x, y);
        this.removeArc(y, x);
    };
    Graph.prototype.createArc = function (start, end, weight) {
        this.adjMat.set(weight, start, end);
    };
    Graph.prototype.removeArc = function (start, end) {
        var array = this.adjMat.array;
        var nil = (array instanceof BigInt64Array || array instanceof BigUint64Array ? 0n : 0);
        this.adjMat.set(nil, start, end);
    };
    Graph.prototype.traverse = function (cb) {
        for (var _i = 0, _a = this.adjMat.byRows(); _i < _a.length; _i++) {
            var _b = _a[_i], x = _b[0], y = _b[1], weight = _b[2];
            if (weight === 0)
                continue;
            cb({
                from: x,
                to: y,
                weight: weight
            });
        }
    };
    Graph.prototype.traverseFrom = function (startNode, cb) {
        var that = this;
        var visitedNodes = new Set();
        function traverse(startNode) {
            for (var i = startNode; i < that.adjMat.rows; i++) {
                var key = startNode + '-' + i;
                if (visitedNodes.has(key))
                    continue;
                if (that.checkAdjacency(startNode, i)) {
                    visitedNodes.add(key);
                    cb({
                        from: startNode,
                        to: i,
                        weight: that.getNodeWeight(startNode, i)
                    });
                    traverse(i);
                }
            }
        }
        traverse(startNode);
    };
    Graph.prototype.transitiveClosure = function () {
        var matrix = this.adjMat.clone();
        var array = matrix.array;
        var n = matrix.rows;
        var yes = (array instanceof BigInt64Array || array instanceof BigUint64Array ? 1n : 1);
        for (var i = 0; i < n; i++) {
            if (this.checkAdjacency(i, i))
                continue;
            matrix.set(yes, i, i);
        }
        for (var y = 0; y < n; y++) {
            for (var x = 0; x < n; x++) {
                if (this.checkAdjacency(y, x)) {
                    for (var z = 0; z < n; z++) {
                        if (this.checkAdjacency(z, y)) {
                            this.adjMat.set(yes, z, x);
                        }
                    }
                }
            }
        }
    };
    return Graph;
}());
function generateRandomAdjacencyMatrix(vertex, density) {
    if (density === void 0) { density = 0.25; }
    var m = new Matrix(Uint16Array, vertex, vertex);
    for (var i = 0; i < vertex; i++) {
        for (var j = i + 1; j < vertex; j++) {
            if (Math.random() < density) {
                m.set(getRandomInt(1, 10), i, j);
                if (Math.random() < density) {
                    m.set(getRandomInt(1, 10), j, i);
                }
            }
        }
    }
    return m;
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (min + max + 1) + min);
    }
}
var nodes = [
    ['0', { 'color': 'blue' }],
    ['1', { 'color': 'red' }],
    ['2', { 'color': 'yellow' }],
    ['3', { 'color': 'green' }],
    ['4', { 'color': 'purple' }],
    ['5', { 'color': 'magenta' }]
];
var g = new GraphVis.Digraph('example');
nodes.forEach(function (node) {
    var n = g.addNode.apply(g, node);
    node.push(n);
});
var graph = new Graph(generateRandomAdjacencyMatrix(5));
graph.traverse(function (_a) {
    var from = _a.from, to = _a.to, weight = _a.weight;
    g.addEdge(nodes[from].at(-1), nodes[to].at(-1), { label: String(weight) });
});
graph.traverseFrom(1, function (_a) {
    var from = _a.from, to = _a.to, weight = _a.weight;
    console.log(from, '-->', to, ': ', weight);
});
g.render('graph');
spawn('dot', ['-Tpng', 'graph.dot', '-o', './graph.png']);
