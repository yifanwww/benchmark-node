import { NumberExt } from './NumberExt';

export type Uint8InInt64 = [number, number, number, number, number, number, number, number];

export class Int64 {
    // Little endian.
    private declare readonly _uint8s: Uint8Array;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly MIN_VALUE: Int64 = new Int64(0, (128 << 23) * 2);

    public get raw(): Uint8InInt64 {
        return [
            this._uint8s[7],
            this._uint8s[6],
            this._uint8s[5],
            this._uint8s[4],
            this._uint8s[3],
            this._uint8s[2],
            this._uint8s[1],
            this._uint8s[0],
        ];
    }

    /**
     * Construct a Int64 integer instance.
     *
     * @param value A number representing a 64-bit JavaScript number.
     */
    public constructor(value: number);
    /**
     * Construct a Int64 integer instance.
     *
     * @param high32 A number representing the high 32 bits.
     * @param low32 A number representing the low 32 bits.
     */
    public constructor(high: number, low: number);
    /**
     * Construct a Int64 integer instance.
     *
     * @param high4 A 8-bit integer representing the high 8 bits for bits 57-64.
     * @param high3 A 8-bit integer representing the high 8 bits for bits 49-56.
     * @param high2 A 8-bit integer representing the high 8 bits for bits 41-48.
     * @param high1 A 8-bit integer representing the high 8 bits for bits 33-40.
     * @param low4 A 8-bit integer representing the low 8 bits for bits 25-32.
     * @param low3 A 8-bit integer representing the low 8 bits for bits 17-24.
     * @param low2 A 8-bit integer representing the low 8 bits for bits 9-16.
     * @param low1 A 8-bit integer representing the low 8 bits for bits 1-8.
     */
    public constructor(
        high4: number,
        high3: number,
        high2: number,
        high1: number,
        low4: number,
        low3: number,
        low2: number,
        low1: number,
    );

    public constructor(...nums: [number] | [number, number] | Uint8InInt64) {
        this._uint8s = new Uint8Array(8);

        if (nums.length === 1 || nums.length === 2) {
            let high: number;
            let low: number;

            if (nums.length === 1) {
                const _num1 = Math.floor(nums[0]);
                high = (_num1 >>> 32) & 0xffffffff;
                low = _num1 & 0xffffffff;
            } else {
                high = Math.floor(nums[0]) & 0xffffffff;
                low = Math.floor(nums[1]) & 0xffffffff;
            }

            this._uint8s[0] = low & 0x000000ff;
            this._uint8s[1] = (low >>> 8) & 0x000000ff;
            this._uint8s[2] = (low >>> 16) & 0x000000ff;
            this._uint8s[3] = (low >>> 24) & 0x000000ff;
            this._uint8s[4] = high & 0x000000ff;
            this._uint8s[5] = (high >>> 8) & 0x000000ff;
            this._uint8s[6] = (high >>> 16) & 0x000000ff;
            this._uint8s[7] = (high >>> 24) & 0x000000ff;
        } else {
            this._uint8s[0] = nums[7];
            this._uint8s[1] = nums[6];
            this._uint8s[2] = nums[5];
            this._uint8s[3] = nums[4];
            this._uint8s[4] = nums[3];
            this._uint8s[5] = nums[2];
            this._uint8s[6] = nums[1];
            this._uint8s[7] = nums[0];
        }
    }

    public isNegative = () => this._uint8s[7] >>> 7 > 0;

    public assign(value: Int64): this {
        this._uint8s[0] = value._uint8s[0];
        this._uint8s[1] = value._uint8s[1];
        this._uint8s[2] = value._uint8s[2];
        this._uint8s[3] = value._uint8s[3];
        this._uint8s[4] = value._uint8s[4];
        this._uint8s[5] = value._uint8s[5];
        this._uint8s[6] = value._uint8s[6];
        this._uint8s[7] = value._uint8s[7];
        return this;
    }

    public plus(value: number): this {
        if (value < 0) {
            return this.minus(-value);
        }

        const old = this._uint8s[0];
        this._uint8s[0] += value;

        if (this._uint8s[0] < old) {
            for (let i = 1; i < 8; i++) {
                if (this._uint8s[i] === 255) {
                    this._uint8s[i] = 0;
                } else {
                    this._uint8s[i] += 1;
                    break;
                }
            }
        }

        return this;
    }

    public minus(value: number): this {
        if (value < 0) {
            return this.plus(-value);
        }

        const old = this._uint8s[0];
        this._uint8s[0] -= value;

        if (this._uint8s[0] > old) {
            for (let i = 1; i < 8; i++) {
                if (this._uint8s[i] === 0) {
                    this._uint8s[i] = 255;
                } else {
                    this._uint8s[i] -= 1;
                    break;
                }
            }
        }

        return this;
    }

    /**
     * @param value 32-bit integer.
     */
    public equals(value: number): boolean;
    public equals(value: Int64): boolean;

    public equals(value: number | Int64): boolean {
        if (typeof value === 'number') {
            return this.equals(new Int64(0, value));
        }

        return (
            this._uint8s[0] === value._uint8s[0] &&
            this._uint8s[1] === value._uint8s[1] &&
            this._uint8s[2] === value._uint8s[2] &&
            this._uint8s[3] === value._uint8s[3] &&
            this._uint8s[4] === value._uint8s[4] &&
            this._uint8s[5] === value._uint8s[5] &&
            this._uint8s[6] === value._uint8s[6] &&
            this._uint8s[7] === value._uint8s[7]
        );
    }

    public toHexString(): string {
        return (
            NumberExt.uint8ToUint32(this._uint8s[4], this._uint8s[5], this._uint8s[6], this._uint8s[7])
                .toString(16)
                .padStart(8, '0') +
            NumberExt.uint8ToUint32(this._uint8s[0], this._uint8s[1], this._uint8s[2], this._uint8s[3])
                .toString(16)
                .padStart(8, '0')
        );
    }
}
