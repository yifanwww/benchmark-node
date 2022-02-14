/* eslint-disable @typescript-eslint/no-loss-of-precision */

const gammaSeries = [
    76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2,
    -0.5395239384953e-5,
];

/**
 * Once PR https://github.com/josdejong/mathjs/pull/2417 is merged, can use `mathjs.gammaln` instead.
 */
export function gammaln(n: number) {
    if (n < 0) return NaN;
    if (n === 0) return Infinity;
    if (!Number.isFinite(n)) return n;

    const lnSqrt2PI = 0.91893853320467274178;

    // Lanczos method
    const n1 = n + 5.5;
    let denom = n + 1;
    let series = 1.000000000190015;
    for (let i = 0; i < 6; i++) {
        series += gammaSeries[i] / denom;
        denom += 1.0;
    }
    return lnSqrt2PI + (n + 0.5) * Math.log(n1) - n1 + Math.log(series / n);
}
