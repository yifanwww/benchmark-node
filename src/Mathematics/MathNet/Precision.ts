/*
 * ref:
 * - https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics/Precision.cs
 * - https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics/Precision.Equality.cs
 */

import { BitConverter, Int64, NumberExt } from '../../Numeric';

export class Precision {
    /**
     * The number of binary digits used to represent the binary number for a double precision floating point value.
     * i.e. there are this many digits used to represent the actual number, where in a number as: 0.134556 * 10^5 the
     * digits are 0.134556 and the exponent is 5.
     *
     * ref: https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics/Precision.cs#L82
     */
    private static doubleWidth: number = 53;

    /**
     * Standard epsilon, the maximum relative precision of IEEE 754 double-precision floating numbers (64 bit).
     * According to the definition of Prof. Demmel and used in LAPACK and Scilab.
     *
     * ref: https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics/Precision.cs#L95
     */
    public static readonly doublePrecision: number = 2 ** -Precision.doubleWidth;

    /**
     * Standard epsilon, the maximum relative precision of IEEE 754 double-precision floating numbers (64 bit).
     * According to the definition of Prof. Higham and used in the ISO C standard and MATLAB.
     *
     * ref: https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics/Precision.cs#L101
     */
    public static readonly positiveDoublePrecision: number = 2 * Precision.doublePrecision;

    /**
     * Value representing 10 * 2^(-53) = 1.11022302462516E-15
     *
     * ref: https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics/Precision.cs#L142
     */
    public static readonly defaultDoubleAccuracy: number = Precision.doublePrecision * 10;

    /**
     * Increments a floating point number to the next bigger number representable by the data type.
     *
     * NOTE:
     * The incrementation step length depends on the provided value.
     * Precision.increment(0, Number.MAX_VALUE) will return positive infinity.
     *
     * @param value The value which needs to be incremented.
     * @param count How many times the number should be incremented.
     * @returns The next larger floating point value.
     *
     * ref: https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics/Precision.cs#L264
     */
    public static increment(value: number, count: number = 1): number {
        if (NumberExt.isInfinity(value) || Number.isNaN(value) || count === 0) {
            return value;
        }

        if (count < 0) {
            return Precision.decrement(value, -count);
        }

        // Translate the bit pattern of the double to an integer.
        // Note that this leads to:
        // double > 0 --> long > 0, growing as the double value grows
        // double < 0 --> long < 0, increasing in absolute magnitude as the double
        //                          gets closer to zero!
        //                          i.e. 0 - double.epsilon will give the largest long value!
        const intValue = BitConverter.doubleToInt64Bits(value);
        if (intValue.isNegative()) {
            intValue.minus(count);
        } else {
            intValue.plus(count);
        }

        // Note that long.MinValue has the same bit pattern as -0.0.
        if (intValue.equals(Int64.MIN_VALUE)) {
            return 0;
        }

        // Note that not all long values can be translated into double values. There's a whole bunch of them
        // which return weird values like infinity and NaN
        return BitConverter.int64BitsToDouble(intValue);
    }

    /**
     * Decrements a floating point number to the next smaller number representable by the data type.
     *
     * NOTE:
     * The decrementation step length depends on the provided value.
     * Precision.decrement(Number.MIN_VALUE) will return negative infinity.
     *
     * @param value The value which should be decremented.
     * @param count How many times the number should be decremented.
     * @returns The next smaller floating point value.
     *
     * ref: https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics/Precision.cs#L313
     */
    public static decrement(value: number, count: number = 1): number {
        if (NumberExt.isInfinity(value) || Number.isNaN(value) || count === 0) {
            return value;
        }

        if (count < 0) {
            // https://github.com/mathnet/mathnet-numerics/issues/904
            return Precision.increment(value, -count);
        }

        // Translate the bit pattern of the double to an integer.
        // Note that this leads to:
        // double > 0 --> long > 0, growing as the double value grows
        // double < 0 --> long < 0, increasing in absolute magnitude as the double
        //                          gets closer to zero!
        //                          i.e. 0 - double.epsilon will give the largest long value!
        const intValue = BitConverter.doubleToInt64Bits(value);

        // If the value is zero then we'd really like the value to be -0. So we'll make it -0
        // and then everything else should work out.
        if (intValue.equals(0)) {
            // Note that long.MinValue has the same bit pattern as -0.0.
            intValue.assign(Int64.MIN_VALUE);
        }

        if (intValue.isNegative()) {
            intValue.plus(count);
        } else {
            intValue.minus(count);
        }

        // Note that not all long values can be translated into double values. There's a whole bunch of them
        // which return weird values like infinity and NaN
        return BitConverter.int64BitsToDouble(intValue);
    }

    /**
     * Compares two doubles and determines if they are equal within the specified maximum error.
     *
     * @param a The norm of the first value (can be negative).
     * @param b The norm of the second value (can be negative).
     * @param diff The norm of the difference of the two values (can be negative).
     * @param maximumError The accuracy required for being almost equal.
     * @returns True if both doubles are almost equal up to the specified maximum error, false otherwise.
     *
     * ref: https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics/Precision.Equality.cs#L91
     */
    public static almostEqualNormRelativeError(a: number, b: number, diff: number, maximumError: number): boolean {
        // If A or B are infinity (positive or negative) then
        // only return true if they are exactly equal to each other -
        // that is, if they are both infinities of the same sign.
        if (NumberExt.isInfinity(a) || NumberExt.isInfinity(b)) {
            return a === b;
        }

        // If A or B are a NAN, return false. NANs are equal to nothing,
        // not even themselves.
        if (Number.isNaN(a) || Number.isNaN(b)) {
            return false;
        }

        // If one is almost zero, fall back to absolute equality
        if (Math.abs(a) < Precision.doublePrecision || Math.abs(b) < Precision.doublePrecision) {
            return Math.abs(diff) < maximumError;
        }

        if ((a === 0 && Math.abs(b) < maximumError) || (b === 0 && Math.abs(a) < maximumError)) {
            return true;
        }

        return Math.abs(diff) < maximumError * Math.max(Math.abs(a), Math.abs(b));
    }

    /**
     * Checks whether two real numbers are almost equal.
     *
     * @param a The first number.
     * @param b The second number.
     * @returns true if the two values differ by no more than 10 * 2^(-52); false otherwise.
     *
     * ref: https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics/Precision.Equality.cs#L282
     */
    public static almostEqualRelative(a: number, b: number): boolean {
        return Precision.almostEqualNormRelativeError(a, b, a - b, Precision.defaultDoubleAccuracy);
    }

    /**
     * Compares two doubles and determines if they are equal to within the specified number of decimal places or not.
     * If the numbers are very close to zero an absolute difference is compared, otherwise the relative difference is
     * compared.
     *
     * The values are equal if the difference between the two numbers is smaller than 10^(-numberOfDecimalPlaces).
     * We divide by two so that we have half the range on each side of the numbers,
     * e.g. if <paramref name="decimalPlaces"/> == 2,
     * then 0.01 will equal between 0.005 and 0.015, but not 0.02 and not 0.00
     *
     * @param a The norm of the first value (can be negative).
     * @param b The norm of the second value (can be negative).
     * @param diff The norm of the difference of the two values (can be negative).
     * @param decimalPlaces The number of decimal places.
     *
     * ref: https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics/Precision.Equality.cs#L395
     */
    public static almostEqualNormRelativeDecimal(a: number, b: number, diff: number, decimalPlaces: number) {
        // if (decimalPlaces < 0)
        // {
        //     // Can't have a negative number of decimal places
        //     throw new ArgumentOutOfRangeException(nameof(decimalPlaces));
        // }

        // If A or B are a NAN, return false. NANs are equal to nothing,
        // not even themselves.
        if (Number.isNaN(a) || Number.isNaN(b)) {
            return false;
        }

        // If A or B are infinity (positive or negative) then
        // only return true if they are exactly equal to each other -
        // that is, if they are both infinities of the same sign.
        if (NumberExt.isInfinity(a) || NumberExt.isInfinity(b)) {
            return a === b;
        }

        // If both numbers are equal, get out now. This should remove the possibility of both numbers being zero
        // and any problems associated with that.
        if (a === b) {
            return true;
        }

        // If one is almost zero, fall back to absolute equality
        if (Math.abs(a) < Precision.doublePrecision || Math.abs(b) < Precision.doublePrecision) {
            // The values are equal if the difference between the two numbers is smaller than
            // 10^(-numberOfDecimalPlaces). We divide by two so that we have half the range
            // on each side of the numbers, e.g. if decimalPlaces == 2,
            // then 0.01 will equal between 0.005 and 0.015, but not 0.02 and not 0.00
            return Math.abs(diff) < Precision.pow10(-decimalPlaces) * 0.5;
        }

        // If the magnitudes of the two numbers are equal to within one magnitude the numbers could potentially be equal
        const magnitudeOfFirst = Precision.magnitude(a);
        const magnitudeOfSecond = Precision.magnitude(b);
        const magnitudeOfMax = Math.max(magnitudeOfFirst, magnitudeOfSecond);
        if (magnitudeOfMax > Math.min(magnitudeOfFirst, magnitudeOfSecond) + 1) {
            return false;
        }

        // The values are equal if the difference between the two numbers is smaller than
        // 10^(-numberOfDecimalPlaces). We divide by two so that we have half the range
        // on each side of the numbers, e.g. if decimalPlaces == 2,
        // then 0.01 will equal between 0.00995 and 0.01005, but not 0.0015 and not 0.0095
        return Math.abs(diff) < Precision.pow10(magnitudeOfMax - decimalPlaces) * 0.5;
    }

    /**
     * Returns the magnitude of the number.
     *
     * @param value The value.
     * @returns The magnitude of the number.
     *
     * ref: https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics/Precision.cs#L154
     */
    public static magnitude(value: number): number {
        // Can't do this with zero because the 10-log of zero doesn't exist.
        if (value === 0.0) {
            return 0;
        }

        // Note that we need the absolute value of the input because Log10 doesn't
        // work for negative numbers (obviously).
        const magnitude = Math.log10(Math.abs(value));
        const truncated = Math.trunc(magnitude);

        // To get the right number we need to know if the value is negative or positive
        // truncating a positive number will always give use the correct magnitude
        // truncating a negative number will give us a magnitude that is off by 1 (unless integer)
        return magnitude < 0 && truncated !== magnitude ? truncated - 1 : truncated;
    }

    /**
     * ref: https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics/Precision.Equality.cs#L1043
     */
    private static negativePowersOf10 = [
        1, 0.1, 0.01, 1e-3, 1e-4, 1e-5, 1e-6, 1e-7, 1e-8, 1e-9, 1e-10, 1e-11, 1e-12, 1e-13, 1e-14, 1e-15, 1e-16, 1e-17,
        1e-18, 1e-19, 1e-20,
    ];

    /**
     * ref: https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics/Precision.Equality.cs#L1050
     */
    private static pow10(y: number): number {
        return -Precision.negativePowersOf10.length < y && y <= 0 ? Precision.negativePowersOf10[-y] : 10.0 ** y;
    }
}
