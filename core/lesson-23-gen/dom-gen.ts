const {JSDOM} = require('jsdom')
const dom = new JSDOM(
    `
    <!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
<div id="container">
    <ul class="list">
        <li class="foo1">1</li>
        <li class="foo2">2</li>
        <li class="foo3" id="center">3</li>
        <li class="foo4">4</li>
        <li class="foo5">5</li>
    </ul>
</div>
</body>
</html>
    `
)

function* siblingsGen(node: Node): IterableIterator<Node> {
    let next: Node | null = node

    do {
        next = next.previousSibling

        if (next != null && next.nodeType === node.ELEMENT_NODE) {
            yield next
        }
    } while (next != null);

    next = node

    do {
        next = next.nextSibling
        if (next != null && next.nodeType === node.ELEMENT_NODE) {
            yield next
        }
    } while (next != null);
}
function* descendantsGen(node: Node): IterableIterator<Node> {
    let next: Node | null = node

    if (next.nodeType === node.ELEMENT_NODE) {
        for (const child of node.childNodes) {
            if (child.nodeType === node.ELEMENT_NODE) {
                yield child
                yield* descendantsGen(child)
            }
        }
    }
}
function* ancestorsGen(node: Node): IterableIterator<Node> {
    let next: Node | null = node

    do {
        next = next.parentNode

        if (next != null && next.nodeType === node.ELEMENT_NODE) {
            yield next
        }
    } while (next != null);
}

function siblingsIter(node: Node): IterableIterator<Node> {
    let next: Node | null = node.previousSibling
    let current: Node

    return {
        [Symbol.iterator]() {
            return this
        },
        next() {
            while(next && next.nodeType !== node.ELEMENT_NODE) {
                next = next.previousSibling
            }
            if (next == null) {
                return {done: true, value: undefined}
            }
            current = next
            next = next.previousSibling
            return {done:false, value: current}
        }
    }
}
function descendantsIter(node: Node): IterableIterator<Node> {
    const stack: Node[] = [node]

    return {
        [Symbol.iterator]() {
            return this
        },
        next() {
            while (stack.length > 0) {
                let current= stack.pop()
                if (current) {
                    current.childNodes.forEach(childNode => {
                        if (childNode.nodeType === node.ELEMENT_NODE) stack.push(childNode)
                    })
                    return {done: false, value: current}
                }
            }
            return {done: true, value: undefined}
        }
    }
}
function ancestorsIter(node: Node): IterableIterator<Node> {
    let next: Node | null = node
    return {
        [Symbol.iterator]() {
            return this
        },
        next() {
            do {
                if (next) next = next.parentNode

                if (next && next.nodeType === node.ELEMENT_NODE) {
                    return {done:false,value:next}
                }
            }
            while (next)
            return {done:true,value:undefined}
        }
    }
}

// console.log(...siblingsIter(dom.window.document.querySelector('#center')));
// console.log(...ancestorsIter(dom.window.document.querySelector('#center')));
// console.log(...descendantsIter(dom.window.document.querySelector('#container')));