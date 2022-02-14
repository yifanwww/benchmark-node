/*
 * ref:
 * - https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics/Distributions/StudentT.cs
 */

import { BetaFunction } from './BetaFunction';
import { Brent } from './Brent';

export class StudentT {
    /**
     * Computes the inverse of the cumulative distribution function (InvCDF) for the distribution at the given
     * probability. This is also known as the quantile or percent point function.
     *
     * @param location The location (μ) of the distribution.
     * @param scale The scale (σ) of the distribution. Range: σ > 0.
     * @param freedom The degrees of freedom (v) for the distribution. Range: v > 0.
     * @param p The location at which to compute the inverse cumulative density.
     * @returns The inverse cumulative density at `p`.
     *
     * ref: https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics/Distributions/StudentT.cs#L462
     */
    public static invCDF(location: number, scale: number, freedom: number, p: number) {
        if (scale <= 0.0 || freedom <= 0.0) {
            throw new Error('Invalid parametrization for the distribution.');
        }

        // In this project, `freedom` won't be positive infinity, so this special case is not implemented.
        // if (double.IsPositiveInfinity(freedom)) {
        //     return Normal.InvCDF(location, scale, p);
        // }

        if (p === 0.5) {
            return location;
        }

        // TODO PERF: We must implement this explicitly instead of solving for CDF^-1
        return Brent.findRoot(
            (x) => {
                const k = (x - location) / scale;
                const h = freedom / (freedom + k * k);
                const ib = 0.5 * BetaFunction.betaRegularized(freedom / 2.0, 0.5, h);
                return x <= location ? ib - p : 1.0 - ib - p;
            },
            -800,
            800,
            1e-12,
        );
    }
}
