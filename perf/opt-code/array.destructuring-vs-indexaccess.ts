// run `node --print-opt-code .\dist\perf\opt-code\array.destructuring-vs-indexaccess.js > opt-code`
// to see how V8 compiles this code.

export {};

type Arr = [number, number, number];

function arrayDestructuring(a: Arr, b: Arr) {
    const [a1, a2, a3] = a;
    const [b1, b2, b3] = b;
    return ((a1 + a2 + a3) << 1) + (b1 << 1) + (b2 << 1) + (b3 << 1);
}

function arrayIndexAccess(a: Arr, b: Arr) {
    return ((a[0] + a[1] + a[2]) << 1) + (b[0] << 1) + (b[1] << 1) + (b[2] << 1);
}

for (let i = 0; i <= 100_000; i++) {
    arrayDestructuring([i, i, i], [i + 100_000, i + 100_000, i + 100_000]);
}

for (let i = 0; i <= 100_000; i++) {
    arrayIndexAccess([i, i, i], [i + 100_000, i + 100_000, i + 100_000]);
}
