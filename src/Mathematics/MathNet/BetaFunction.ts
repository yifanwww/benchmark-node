/*
 * ref:
 * - https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics/SpecialFunctions/Beta.cs
 */

/* eslint-disable @typescript-eslint/no-loss-of-precision */

import { gammaln } from '../Gammaln';
import { Precision } from './Precision';

export class BetaFunction {
    /**
     * Returns the regularized lower incomplete beta function I_x(a,b) = 1/Beta(a,b) * int(t^(a-1)*(1-t)^(b-1),t=0..x)
     * for real a &gt; 0, b &gt; 0, 1 &gt;= x &gt;= 0.
     *
     * @param a The first Beta parameter, a positive real number.
     * @param b The second Beta parameter, a positive real number.
     * @param x The upper limit of the integral.
     * @returns The regularized lower incomplete beta function.
     *
     * ref: https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics/SpecialFunctions/Beta.cs#L98
     */
    public static betaRegularized(a: number, b: number, x: number): number {
        if (a < 0.0) {
            throw new Error('Value must not be negative (zero is ok). (a)');
        }

        if (b < 0.0) {
            throw new Error('Value must not be negative (zero is ok). (b)');
        }

        if (x < 0.0 || x > 1.0) {
            throw new Error('Value is expected to be between 0.0 and 1.0 (including 0.0 and 1.0). (x)');
        }

        const bt =
            x === 0.0 || x === 1.0
                ? 0.0
                : Math.exp(gammaln(a + b) - gammaln(a) - gammaln(b) + a * Math.log(x) + b * Math.log(1.0 - x));

        const symmetryTransformation = x >= (a + 1.0) / (a + b + 2.0);

        /* Continued fraction representation */
        const eps = Precision.doublePrecision;
        const fpmin = Precision.increment(0.0) / eps;

        if (symmetryTransformation) {
            x = 1.0 - x;
            const swap = a;
            a = b;
            b = swap;
        }

        const qab = a + b;
        const qap = a + 1.0;
        const qam = a - 1.0;
        let c = 1.0;
        let d = 1.0 - (qab * x) / qap;

        if (Math.abs(d) < fpmin) {
            d = fpmin;
        }

        d = 1.0 / d;
        let h = d;

        for (let m = 1, m2 = 2; m <= 50000; m++, m2 += 2) {
            let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
            d = 1.0 + aa * d;

            if (Math.abs(d) < fpmin) {
                d = fpmin;
            }

            c = 1.0 + aa / c;
            if (Math.abs(c) < fpmin) {
                c = fpmin;
            }

            d = 1.0 / d;
            h *= d * c;
            aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
            d = 1.0 + aa * d;

            if (Math.abs(d) < fpmin) {
                d = fpmin;
            }

            c = 1.0 + aa / c;

            if (Math.abs(c) < fpmin) {
                c = fpmin;
            }

            d = 1.0 / d;
            const del = d * c;
            h *= del;

            if (Math.abs(del - 1.0) <= eps) {
                return symmetryTransformation ? 1.0 - (bt * h) / a : (bt * h) / a;
            }
        }

        return symmetryTransformation ? 1.0 - (bt * h) / a : (bt * h) / a;
    }
}
