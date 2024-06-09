interface StructureTypeApi<T = unknown> {
    get(): number
    set(value: T): void
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
}