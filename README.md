# benchmark-node

A Node.js benchmarking library for accurate performance test.

## Usage
### `Benchmark`

```ts
import { Arguments, Benchmark } from 'benchmark-node';

const benchmark = new Benchmark();

benchmark.add('Benchmark-1', () => {});
benchmark.add('Benchmark-2', (arg1, arg2, arg3) => arg3, {
    args: [new Arguments(1, 2, 3), new Arguments('a', 'b', 'c')],
});

benchmark.run();
```

## Develop this package

Execute `npm run dev` to watch the building.

Execute `npm run test` or `npm run test-full` to do unit test.

Execute `npm run build-test` or `yarn build-test` to build both source code and test code,
then can run js files in folder `dist/test` to view the output of benchmarking.

## Build this package

Execute `npm run build` or `yarn build` to build this package.
