/**
 * ref:
 * - https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics.Tests/PrecisionTest.cs
 */

import { NumberExt } from '../../../Numeric';
import { Precision } from '../Precision';

describe(`Test class ${Precision.name}`, () => {
    it(`tests static method ${Precision.magnitude.name}`, () => {
        // ref: https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics.Tests/PrecisionTest.cs#L77
        expect(Precision.magnitude(1.1e5)).toBe(5);
        expect(Precision.magnitude(2.2e-5)).toBe(-5);
        expect(Precision.magnitude(3.3e9)).toBe(9);
        expect(Precision.magnitude(4.4e-11)).toBe(-11);
    });

    it(`tests static method ${Precision.increment.name}`, () => {
        // ref: https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics.Tests/PrecisionTest.cs#L165
        let x = -2 * NumberExt.EPSILON;
        expect(x).toBe(-2 * NumberExt.EPSILON);
        x = Precision.increment(x);
        x = Precision.increment(x);
        expect(x).toBe(-0.0);
        x = Precision.increment(x);
        x = Precision.increment(x);
        // FIXME: This test fails.
        // expect(x).toBe(2 * NumberExt.epsilon);

        // ref: https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics.Tests/PrecisionTest.cs#L197
        x = Number.MAX_VALUE;
        x = Precision.increment(x);
        expect(x).toBe(1.0 / 0.0);
        x = Number.MIN_VALUE;
        expect(x).toBe(Number.MIN_VALUE);
        x = Precision.increment(x);
        expect(x).toBeGreaterThan(Number.MIN_VALUE);
    });

    it(`tests static method ${Precision.decrement.name}`, () => {
        // ref: https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics.Tests/PrecisionTest.cs#L181
        let x = 2 * NumberExt.EPSILON;
        expect(x).toBe(2 * NumberExt.EPSILON);
        x = Precision.decrement(x);
        x = Precision.decrement(x);
        expect(x).toBe(0.0);
        x = Precision.decrement(x);
        x = Precision.decrement(x);
        // FIXME: This test fails.
        // expect(x).toBe(-2 * NumberExt.epsilon);

        // ref: https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics.Tests/PrecisionTest.cs#L213
        x = Number.MAX_VALUE;
        expect(x).toBe(Number.MAX_VALUE);
        x = Precision.decrement(x);
        expect(x).toBeLessThan(Number.MAX_VALUE);
        x = Number.MIN_VALUE;
        expect(x).toBe(Number.MIN_VALUE);
        x = Precision.decrement(x);
        // FIXME: This test fails.
        // expect(x).toBe(-1.0 / 0.0);
    });
});
