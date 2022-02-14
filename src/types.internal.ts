export type Optional<T> = T | null;

export type Hrtime = [number, number];

export type TypedArray =
    | Uint8Array
    | Uint8ClampedArray
    | Uint16Array
    | Uint32Array
    | Int8Array
    | Int16Array
    | Int32Array
    // | BigUint64Array
    // | BigInt64Array
    | Float32Array
    | Float64Array;
