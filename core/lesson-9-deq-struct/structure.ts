interface StructureTypeApi<T = unknown> {
    get(): T
    set(value: T): void
}

interface StructureType {
    (): number
    (offset: number, buffer: ArrayBuffer): StructureTypeApi
}

type StructureTypeDesc = number | StructureTypeApi

class Structure {
    static U8(): number
    static U8(offset: number, buffer: ArrayBuffer): StructureTypeApi
    static U8(offset?: number, buffer?: ArrayBuffer): StructureTypeDesc {
        if (offset == null || buffer == null) {
            return 1 // 1 byte
        }

        return {
            get(): number {
                return new Uint8Array(buffer, offset, 1)[0]
            },
            set(value: number) {
                const arr = new Uint8Array(buffer, offset, 1)
                arr[0] = value
            }
        }
    }
    static U(bits: number): StructureType {
        const bytes = Math.ceil(bits / 8)
        const mask = createMask(bits)

        if (bits > 32) {
            throw new RangeError('The number of bytes is out of bounds.')
        }

        return ((offset?:number, buffer?: ArrayBuffer): StructureTypeDesc => {
            if (offset == null || buffer == null) {
                return bytes
            }

            return {
                get(): number {
                    return new Uint8Array(buffer, offset, bytes)[0] & mask
                },
                set(value: number) {
                    const arr = new Uint8Array(buffer, offset, bytes)

                    for (let i = 0; i < bytes; i++) {
                        arr[i] = value >>> i * 8 & 0xFF
                    }
                }
            }
        }) as any
        function createMask(length: number): number {
            return ~0 >>> 32 - length
        }
    }
    static String(encoding: string, size: number): StructureType {
        encoding = encoding.toLowerCase()

        return ((offset?: number, buffer?: ArrayBuffer): StructureTypeDesc => {
            if (offset == null || buffer == null) {
               return size * encodingPerBytes()
            }
            return {
                set(value: string): void {
                    switch (encoding) {
                        case 'ascii': {
                            const arr = new Uint8Array(buffer, offset, size)

                            for(let i = 0; i < size; i++) {
                                arr[i] = value.charCodeAt(i)
                            }
                            break
                        }
                    }
                },
                get():string {
                    let str = ''

                    switch (encoding) {
                        case 'ascii': {
                            const arr = new Uint8Array(buffer, offset, size)

                            for (const charCode of arr) {
                                str += String.fromCharCode(charCode)
                            }

                            break
                        }
                    }

                    return str
                }
            }
        }) as any

        function encodingPerBytes() {
            switch (encoding) {
                case 'ascii': return 1
                default: return 2
            }
        }
    }
    static Tuple(...values: (Structure | StructureType)[]): Structure {
        const struct = values.reduce((struct, type, i) => {
            struct[String(i)] = type
            return struct
        }, {} as Record<string, Structure | StructureType>)

        return new Structure(struct)
    }

    readonly size: number
    readonly scheme: Record<string, StructureType>

    constructor(scheme: Record<string, Structure | StructureType>) {
        let schemeSize = 0

        const normalizedScheme: Record<string, StructureType> = {}

        Object.entries(scheme).forEach(([key, type]) => {
            normalizedScheme[key] = type instanceof Structure ? type.toType() : type
            schemeSize += normalizedScheme[key]()
        })
        this.size = schemeSize
        this.scheme = normalizedScheme
    }

    create(data: Record<string, unknown> | unknown[], buffer: ArrayBuffer = new ArrayBuffer(this.size), offset: number = 0): Record<string, any> {
        const { size } = this

        const view = {
            get buffer() {
                return buffer
            },
            get size() {
                return size
            }
        }

        Object.entries(this.scheme).forEach(([key, type]) => {
            const {get, set} = type(offset, buffer)
            // @ts-ignore
            set(data[key])

            Object.defineProperty(view, key, {
                enumerable: true,
                configurable: true,
                get,
                set
            })

            offset += type()
        })

        return view
    }

    from(buffer: ArrayBuffer, offset: number = 0): Record<string, any> {
        const { size } = this

        const view = {
            get buffer() {
                return buffer
            },
            get size() {
                return size
            }
        }

        Object.entries(this.scheme).forEach(([key, type]) => {
            const {get, set} = type(offset, buffer)

            Object.defineProperty(view, key, {
                enumerable: true,
                configurable: true,
                get,
                set
            })

        })

        return view
    }

    toType(): StructureType {
        return ((offset?: number, buffer?: ArrayBuffer): StructureTypeDesc => {
            if (offset == null || buffer == null) {
                return this.size
            }

            let structure: Record<string, unknown> = this.from(buffer, offset)

            return {
                get:() => structure,
                set:(data: Record<string, unknown>) => {
                    structure = this.create(data, buffer, offset)
                }
            }
        }) as any
    }
}

const Skills = new Structure({
    singing: Structure.U8, // Unsigned число 8 бит
    dancing: Structure.U8,
    fighting: Structure.U8
});

// Кортеж из 3-х чисел
const Color = Structure.Tuple(Structure.U8, Structure.U8, Structure.U8)

const Person = new Structure({
    firstName: Structure.String('ascii', 3), // Строка в кодировке ASCII
    lastName: Structure.String('ascii', 4),
    age: Structure.U(7),                  // Unsigned число 7 бит,
    skills: Skills,
    color: Color
});
const bob = Person.create({
    firstName: 'Bob', // Тут придется сконвертировать UTF-16 в ASCII
    lastName: 'King',
    age: 42,
    skills: Skills.create({singing: 100, dancing: 100, fighting: 50}),
    color: Color.create([255, 0, 200])
});

console.log(bob.size); // Количество занимаемых байт конкретной структурой
console.log(bob.buffer);         // ArrayBuffer
console.log(bob.firstName);      // Тут идет обратная конвертация в UTF-16 из ASCII
console.log(bob.skills.singing); // 100

const bobClone = Person.from(bob.buffer.slice());
console.log(bobClone)