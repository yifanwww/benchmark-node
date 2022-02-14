import { Int64 } from './Int64';

export class BitConverter {
    public static doubleToInt64Bits(value: number): Int64 {
        const float64 = new Float64Array(1);
        float64[0] = value;
        const uint8View = new Uint8Array(float64.buffer);
        return new Int64(
            uint8View[7],
            uint8View[6],
            uint8View[5],
            uint8View[4],
            uint8View[3],
            uint8View[2],
            uint8View[1],
            uint8View[0],
        );
    }

    public static int64BitsToDouble(value: Int64): number {
        const float64 = new Float64Array(1);
        const uint8View = new Uint8Array(float64.buffer);
        [
            uint8View[7],
            uint8View[6],
            uint8View[5],
            uint8View[4],
            uint8View[3],
            uint8View[2],
            uint8View[1],
            uint8View[0],
        ] = value.raw;
        return float64[0];
    }
}
