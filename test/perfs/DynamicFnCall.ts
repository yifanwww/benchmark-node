// Added for '--isolatedModules`
export {};

// You can run `node --print-opt-code ./dist/test/dynamicCall.js > opt-code` to see how V8 compiles this function.
function caller(testFn: () => void) {
    for (let i = 0; i < 1e8; i++) {
        testFn();
    }
}

let num = 0;
function benchmark(testFn: () => void) {
    const begin = process.hrtime();
    caller(testFn);
    const elapsed = process.hrtime(begin);
    console.log(++num, elapsed);
}

const noop1 = () => {};
const noop2 = () => {};
benchmark(noop1);
benchmark(noop1);
benchmark(noop1);
benchmark(noop2);
benchmark(noop2);
benchmark(noop2);
