var Structure = /** @class */ (function () {
    function Structure(scheme) {
        var schemeSize = 0;
        var normalizedScheme = {};
        Object.entries(scheme).forEach(function (_a) {
            var key = _a[0], type = _a[1];
            normalizedScheme[key] = type instanceof Structure ? type.toType() : type;
            schemeSize += normalizedScheme[key]();
        });
        this.size = schemeSize;
        this.scheme = normalizedScheme;
    }
    Structure.U8 = function (offset, buffer) {
        if (offset == null || buffer == null) {
            return 1; // 1 byte
        }
        return {
            get: function () {
                return new Uint8Array(buffer, offset, 1)[0];
            },
            set: function (value) {
                var arr = new Uint8Array(buffer, offset, 1);
                arr[0] = value;
            }
        };
    };
    Structure.U = function (bits) {
        var bytes = Math.ceil(bits / 8);
        var mask = createMask(bits);
        if (bits > 32) {
            throw new RangeError('The number of bytes is out of bounds.');
        }
        return (function (offset, buffer) {
            if (offset == null || buffer == null) {
                return bytes;
            }
            return {
                get: function () {
                    return new Uint8Array(buffer, offset, bytes)[0] & mask;
                },
                set: function (value) {
                    var arr = new Uint8Array(buffer, offset, bytes);
                    for (var i = 0; i < bytes; i++) {
                        arr[i] = value >>> i * 8 & 0xFF;
                    }
                }
            };
        });
        function createMask(length) {
            return ~0 >>> 32 - length;
        }
    };
    Structure.String = function (encoding, size) {
        encoding = encoding.toLowerCase();
        return (function (offset, buffer) {
            if (offset == null || buffer == null) {
                return size * encodingPerBytes();
            }
            return {
                set: function (value) {
                    switch (encoding) {
                        case 'ascii': {
                            var arr = new Uint8Array(buffer, offset, size);
                            for (var i = 0; i < size; i++) {
                                arr[i] = value.charCodeAt(i);
                            }
                            break;
                        }
                    }
                },
                get: function () {
                    var str = '';
                    switch (encoding) {
                        case 'ascii': {
                            var arr = new Uint8Array(buffer, offset, size);
                            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                                var charCode = arr_1[_i];
                                str += String.fromCharCode(charCode);
                            }
                            break;
                        }
                    }
                    return str;
                }
            };
        });
        function encodingPerBytes() {
            switch (encoding) {
                case 'ascii': return 1;
                default: return 2;
            }
        }
    };
    Structure.Tuple = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        var struct = values.reduce(function (struct, type, i) {
            struct[String(i)] = type;
            return struct;
        }, {});
        return new Structure(struct);
    };
    Structure.prototype.create = function (data, buffer, offset) {
        if (buffer === void 0) { buffer = new ArrayBuffer(this.size); }
        if (offset === void 0) { offset = 0; }
        var size = this.size;
        var view = {
            get buffer() {
                return buffer;
            },
            get size() {
                return size;
            }
        };
        Object.entries(this.scheme).forEach(function (_a) {
            var key = _a[0], type = _a[1];
            var _b = type(offset, buffer), get = _b.get, set = _b.set;
            // @ts-ignore
            set(data[key]);
            Object.defineProperty(view, key, {
                enumerable: true,
                configurable: true,
                get: get,
                set: set
            });
            offset += type();
        });
        return view;
    };
    Structure.prototype.from = function (buffer, offset) {
        if (offset === void 0) { offset = 0; }
        var size = this.size;
        var view = {
            get buffer() {
                return buffer;
            },
            get size() {
                return size;
            }
        };
        Object.entries(this.scheme).forEach(function (_a) {
            var key = _a[0], type = _a[1];
            var _b = type(offset, buffer), get = _b.get, set = _b.set;
            Object.defineProperty(view, key, {
                enumerable: true,
                configurable: true,
                get: get,
                set: set
            });
        });
        return view;
    };
    Structure.prototype.toType = function () {
        var _this = this;
        return (function (offset, buffer) {
            if (offset == null || buffer == null) {
                return _this.size;
            }
            var structure = _this.from(buffer, offset);
            return {
                get: function () { return structure; },
                set: function (data) {
                    structure = _this.create(data, buffer, offset);
                }
            };
        });
    };
    return Structure;
}());
var Skills = new Structure({
    singing: Structure.U8, // Unsigned число 8 бит
    dancing: Structure.U8,
    fighting: Structure.U8
});
// Кортеж из 3-х чисел
var Color = Structure.Tuple(Structure.U8, Structure.U8, Structure.U8);
var Person = new Structure({
    firstName: Structure.String('ascii', 3), // Строка в кодировке ASCII
    lastName: Structure.String('ascii', 4),
    age: Structure.U(7), // Unsigned число 7 бит,
    skills: Skills,
    color: Color
});
var bob = Person.create({
    firstName: 'Bob', // Тут придется сконвертировать UTF-16 в ASCII
    lastName: 'King',
    age: 42,
    skills: Skills.create({ singing: 100, dancing: 100, fighting: 50 }),
    color: Color.create([255, 0, 200])
});
console.log(bob.size); // Количество занимаемых байт конкретной структурой
console.log(bob.buffer); // ArrayBuffer
console.log(bob.firstName); // Тут идет обратная конвертация в UTF-16 из ASCII
console.log(bob.skills.singing); // 100
var bobClone = Person.from(bob.buffer.slice());
console.log(bobClone);
