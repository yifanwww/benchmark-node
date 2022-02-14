/* eslint-disable @typescript-eslint/no-loss-of-precision */

import { Benchmark } from '../../src';

function gammalnWithMalloc(n: number) {
    if (n < 0) return NaN;
    if (n === 0) return Infinity;
    if (!Number.isFinite(n)) return n;

    const _lnSqrt2PI = 0.91893853320467274178;
    const _gammaSeries = [
        76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2,
        -0.5395239384953e-5,
    ];

    // Lanczos method
    const n1 = n + 5.5;
    let denom = n + 1;
    let series = 1.000000000190015;
    for (let i = 0; i < 6; i++) {
        series += _gammaSeries[i] / denom;
        denom += 1.0;
    }
    return _lnSqrt2PI + (n + 0.5) * Math.log(n1) - n1 + Math.log(series / n);
}

const gammaSeries = [
    76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2,
    -0.5395239384953e-5,
];

function gammalnWithoutMalloc(n: number) {
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

const benchmark = new Benchmark();

benchmark.add('gammaln-with-malloc', () => {
    let res = gammalnWithMalloc(-1);
    res = gammalnWithMalloc(0);
    res = gammalnWithMalloc(0.001);
    res = gammalnWithMalloc(0.1);
    res = gammalnWithMalloc(1);
    res = gammalnWithMalloc(2);
    res = gammalnWithMalloc(3);
    res = gammalnWithMalloc(4.5);
    res = gammalnWithMalloc(5.9);
    res = gammalnWithMalloc(7.5);
    res = gammalnWithMalloc(12.5);
    res = gammalnWithMalloc(25);
    res = gammalnWithMalloc(47.123);
    res = gammalnWithMalloc(155.5555);
    res = gammalnWithMalloc(555.5555);
    res = gammalnWithMalloc(2555.5555);
    res = gammalnWithMalloc(12345.6789);
    res = gammalnWithMalloc(123456.789);
    return res;
});
benchmark.add('gammaln-without-malloc', () => {
    let res = gammalnWithoutMalloc(-1);
    res = gammalnWithoutMalloc(0);
    res = gammalnWithoutMalloc(0.001);
    res = gammalnWithoutMalloc(0.1);
    res = gammalnWithoutMalloc(1);
    res = gammalnWithoutMalloc(2);
    res = gammalnWithoutMalloc(3);
    res = gammalnWithoutMalloc(4.5);
    res = gammalnWithoutMalloc(5.9);
    res = gammalnWithoutMalloc(7.5);
    res = gammalnWithoutMalloc(12.5);
    res = gammalnWithoutMalloc(25);
    res = gammalnWithoutMalloc(47.123);
    res = gammalnWithoutMalloc(155.5555);
    res = gammalnWithoutMalloc(555.5555);
    res = gammalnWithoutMalloc(2555.5555);
    res = gammalnWithoutMalloc(12345.6789);
    res = gammalnWithoutMalloc(123456.789);
    return res;
});

benchmark.run();
