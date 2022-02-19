/**
 * ref:
 * - https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics/Precision.Equality.cs
 * - https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics.Tests/AssertHelpers.cs
 */

import assert from 'assert';

import { Precision } from '../Mathematics/MathNet/Precision';

export class AssertHelpers {
    /**
     * Compares two doubles and determines if they are equal to within the specified number of decimal places or not.
     * If the numbers are very close to zero an absolute difference is compared, otherwise the relative difference is
     * compared.
     *
     * @param expected The expected value.
     * @param actual The actual value.
     * @param decimalPlaces The number of decimal places.
     *
     * ref:
     * - https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics.Tests/AssertHelpers.cs#L131
     * - https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics/Precision.Equality.cs#L526
     */
    public static almostEqualRelative(expected: number, actual: number, decimalPlaces: number): void {
        if (Number.isNaN(expected) && Number.isNaN(actual)) {
            return;
        }

        if (!Precision.almostEqualNormRelativeDecimal(expected, actual, expected - actual, decimalPlaces)) {
            assert.fail(`Not equal within ${decimalPlaces} places. Expected: ${expected}; Actual: ${actual}`);
        }
    }
}
