type typedArrayTypes =
    Uint8Array |
    Uint8ClampedArray |
    Int8Array |
    Uint16Array |
    Uint32Array |
    Int32Array |
    Float32Array |
    Float64Array |
    BigUint64Array |
    BigInt64Array


const GraphVis = require('graphviz-node');
const {spawn} = require('node:child_process');

interface IMatrix<T extends typedArrayTypes> {
    set(value: NumType<T>, x: number, y: number): void;
    set(value: NumType<T>, y: number, x: number): void;
}
interface Edge<T extends typedArrayTypes> {
    to: number
    from: number
    weight: NumType<T>
}

type TypedArray<T> = new (capacity: number) => T
type NumType<T extends typedArrayTypes> = T extends BigInt64Array | BigUint64Array ? bigint : number

class Matrix<T extends typedArrayTypes> implements IMatrix<T> {
    readonly TypedArray: TypedArray<T>;
    readonly array: T
    readonly rows: number
    readonly cols: number

    get buffer() {
        return this.array.buffer
    }
    constructor(TypedArray: TypedArray<T>, rows: number, cols: number, data?: T) {
        this.TypedArray = TypedArray
        this.array = new TypedArray(rows * cols)
        this.rows = rows
        this.cols = cols

        if (data != null) {
            this.array.set(data as any)
        }
    }
    get(start: number, end: number) {
        return this.array[this.getIndex(start, end)]
    }
    set(value: NumType<T>, start: number, end: number) {
        return this.array[this.getIndex(start, end)] = value
    }
    clone() {
        return new Matrix(this.TypedArray, this.rows, this.cols, this.array)
    }
    protected getIndex(start: number, end: number) {
        return [start, end].reduce((acc, coord, i) => acc += coord * Math.pow([this.rows, this.cols][i], i))
    }
    *byRows(): IterableIterator<[number, number, NumType<T>]> {
        for (let x = 0; x < this.rows; x++) {
            for (let y = 0; y < this.cols; y++) {
                yield [x, y, this.get(x, y) as NumType<T>]
            }
        }
    }
    *byCols(): IterableIterator<[number, number, NumType<T>]> {
        for (let y = 0; y < this.cols; y++) {
            for (let x = 0; x < this.rows; x++) {
                yield [x, y, this.get(x, y) as NumType<T>]
            }
        }
    }
}

class Graph<T extends typedArrayTypes> {
    readonly adjMat: Matrix<T>

    constructor(matrix: Matrix<T>) {
        this.adjMat = matrix
    }

    checkAdjacency(x: number, y: number): boolean {
        return this.adjMat.get(x, y) > 0
    }
    getNodeWeight(start: number, end: number) {
        return this.adjMat.get(start, end)
    }
    createEdge(x: number, y: number, weight: NumType<T>): void {
        this.adjMat.set(weight, x, y)
        this.adjMat.set(weight, y, x)
    }
    removeEdge(x: number, y: number): void {
        this.removeArc(x, y)
        this.removeArc(y, x)
    }
    createArc(start: number, end: number, weight: NumType<T>): void {
        this.adjMat.set(weight, start, end)
    }
    removeArc(start: number, end: number): void {
        const {array} = this.adjMat
        const nil = (array instanceof BigInt64Array || array instanceof BigUint64Array ? 0n : 0) as NumType<T>

        this.adjMat.set(nil, start, end)
    }
    traverse(cb: (edge: Edge<T>) => void) {
        for (const [x, y, weight] of this.adjMat.byRows()) {
            if (weight === 0) continue

            cb({
                from: x,
                to: y,
                weight
            })
        }
    }
    traverseFrom(startNode: number, cb: (edge: Edge<T>) => void): void {
        const that = this

        const visitedNodes = new Set()

        function traverse(startNode: number): void {
            for (let i = startNode; i < that.adjMat.rows; i++) {
                const key = startNode + '-' + i

                if (visitedNodes.has(key)) continue

                if (that.checkAdjacency(startNode, i)) {
                    visitedNodes.add(key)

                    cb({
                        from: startNode,
                        to: i,
                        weight: that.getNodeWeight(startNode, i) as NumType<T>
                    })

                    traverse(i)
                }
            }
        }
        traverse(startNode)
    }
    transitiveClosure() {
        const matrix = this.adjMat.clone()
        const {array} = matrix
        const n = matrix.rows
        const yes = (array instanceof BigInt64Array || array instanceof BigUint64Array ? 1n : 1) as NumType<T>

        for (let i = 0; i < n; i++) {
            if (this.checkAdjacency(i, i)) continue

            matrix.set(yes, i, i)
        }

        for (let y = 0; y < n; y++) {
            for (let x = 0; x < n; x++) {
                if (this.checkAdjacency(y, x)) {
                    for (let z = 0; z < n; z++) {
                        if (this.checkAdjacency(z, y)) {
                            this.adjMat.set(yes, z, x)
                        }
                    }  
                }
            }
        }
    }
}

function generateRandomAdjacencyMatrix(vertex: number, density: number = 0.25) {
    const m = new Matrix(Uint16Array, vertex, vertex)

    for (let i = 0; i < vertex; i++) {
        for (let j = i + 1; j < vertex; j++) {
            if (Math.random() < density) {
                m.set(getRandomInt(1, 10), i, j)

                if (Math.random() < density) {
                    m.set(getRandomInt(1, 10), j, i)
                }
            }
        }
    }
    return m

    function getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (min + max + 1) + min)
    }
}

const nodes = [
    ['0', {'color': 'blue'}],
    ['1', {'color': 'red'}],
    ['2', {'color': 'yellow'}],
    ['3', {'color': 'green'}],
    ['4', {'color': 'purple'}],
    ['5', {'color': 'magenta'}]
]

const g = new GraphVis.Digraph('example');

nodes.forEach((node) => {
    const n = g.addNode(...node)
    node.push(n)
})

const graph = new Graph(generateRandomAdjacencyMatrix(5))

graph.traverse(({from, to, weight}) => {
    g.addEdge(nodes[from].at(-1), nodes[to].at(-1), {label: String(weight)})
})

graph.traverseFrom(1, ({from, to, weight}) => {
    console.log(from, '-->', to, ': ', weight);
    
})

g.render('graph')

spawn('dot', ['-Tpng', 'graph.dot', '-o', './graph.png'])