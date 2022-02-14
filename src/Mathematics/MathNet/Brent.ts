/*
 * ref:
 * - https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics/RootFinding/Brent.cs
 */

import { createRef, MutableRefObject } from '../../Tools/Ref';

import { Precision } from './Precision';

export class Brent {
    /**
     * Find a solution of the equation f(x)=0.
     *
     * @param fn The function to find roots from.
     * @param lowerBound The low value of the range where the root is supposed to be.
     * @param upperBound The high value of the range where the root is supposed to be.
     * @param accuracy Desired accuracy. The root will be refined until the accuracy or the maximum number of iterations
     * is reached. Default 1e-8. Must be greater than 0.
     * @param maxIterations Maximum number of iterations. Default 100.
     * @returns Returns the root with the specified accuracy.
     *
     * ref: https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics/RootFinding/Brent.cs#L64
     */
    public static findRoot(
        fn: (n: number) => number,
        lowerBound: number,
        upperBound: number,
        accuracy: number = 1e-8,
        maxIterations: number = 100,
    ): number {
        // Simulates the `out` in C#
        const root = createRef<number>(0);
        if (Brent.tryFindRoot(fn, lowerBound, upperBound, accuracy, maxIterations, root)) {
            return root.current;
        }

        throw new Error(
            'The algorithm has failed, exceeded the number of iterations allowed or there is no root within the' +
                ' provided bounds.',
        );
    }

    /**
     * Find a solution of the equation f(x)=0.
     *
     * @param fn The function to find roots from.
     * @param lowerBound The low value of the range where the root is supposed to be.
     * @param upperBound The high value of the range where the root is supposed to be.
     * @param accuracy Desired accuracy. The root will be refined until the accuracy or the maximum number of iterations
     * is reached. Must be greater than 0.
     * @param maxIterations Maximum number of iterations. Usually 100.
     * @param root The root that was found, if any. Undefined if the function returns false.
     * @returns True if a root with the specified accuracy was found, else false.
     *
     * ref: https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics/RootFinding/Brent.cs#L82
     */
    private static tryFindRoot(
        fn: (n: number) => number,
        lowerBound: number,
        upperBound: number,
        accuracy: number,
        maxIterations: number,
        root: MutableRefObject<number>,
    ): boolean {
        if (accuracy <= 0) {
            throw new Error('Must be greater than zero. (accuracy)');
        }

        let fmin = fn(lowerBound);
        let fmax = fn(upperBound);
        let froot = fmax;
        let d = 0.0;
        let e = 0.0;

        root.current = upperBound;
        let xMid = Number.NaN;

        // Root must be bracketed.
        if (Math.sign(fmin) === Math.sign(fmax)) {
            return false;
        }

        for (let i = 0; i <= maxIterations; i++) {
            // adjust bounds
            if (Math.sign(froot) === Math.sign(fmax)) {
                upperBound = lowerBound;
                fmax = fmin;
                e = root.current - lowerBound;
                d = root.current - lowerBound;
            }

            if (Math.abs(fmax) < Math.abs(froot)) {
                lowerBound = root.current;
                root.current = upperBound;
                upperBound = lowerBound;
                fmin = froot;
                froot = fmax;
                fmax = fmin;
            }

            // convergence check
            const xAcc1 = Precision.positiveDoublePrecision * Math.abs(root.current) + 0.5 * accuracy;
            const xMidOld = xMid;
            xMid = (upperBound - root.current) / 2.0;

            if (Math.abs(xMid) <= xAcc1 || Precision.almostEqualNormRelativeError(froot, 0, froot, accuracy)) {
                return true;
            }

            if (xMid === xMidOld) {
                // accuracy not sufficient, but cannot be improved further
                return false;
            }

            if (Math.abs(e) >= xAcc1 && Math.abs(fmin) > Math.abs(froot)) {
                // Attempt inverse quadratic interpolation
                const s = froot / fmin;
                let p;
                let q;
                if (Precision.almostEqualRelative(lowerBound, upperBound)) {
                    p = 2.0 * xMid * s;
                    q = 1.0 - s;
                } else {
                    q = fmin / fmax;
                    const r = froot / fmax;
                    p = s * (2.0 * xMid * q * (q - r) - (root.current - lowerBound) * (r - 1.0));
                    q = (q - 1.0) * (r - 1.0) * (s - 1.0);
                }

                if (p > 0.0) {
                    // Check whether in bounds
                    q = -q;
                }

                p = Math.abs(p);
                if (2.0 * p < Math.min(3.0 * xMid * q - Math.abs(xAcc1 * q), Math.abs(e * q))) {
                    // Accept interpolation
                    e = d;
                    d = p / q;
                } else {
                    // Interpolation failed, use bisection
                    d = xMid;
                    e = d;
                }
            } else {
                // Bounds decreasing too slowly, use bisection
                d = xMid;
                e = d;
            }

            lowerBound = root.current;
            fmin = froot;
            if (Math.abs(d) > xAcc1) {
                root.current += d;
            } else {
                root.current += Brent.sign(xAcc1, xMid);
            }

            froot = fn(root.current);
        }

        return false;
    }

    /**
     * Helper method useful for preventing rounding errors.
     *
     * @returns a*sign(b)
     *
     * ref: https://github.com/mathnet/mathnet-numerics/blob/v5.0.0-alpha09/src/Numerics/RootFinding/Brent.cs#L204
     */
    private static sign(a: number, b: number): number {
        if (b >= 0) {
            return a >= 0 ? a : -a;
        } else {
            return a >= 0 ? -a : a;
        }
    }
}
