import { Arguments, Benchmark } from '../src';

const benchmark = new Benchmark();
benchmark.add('test1', () => {});
benchmark.add(function test2() {});
benchmark.add('test3', (arg1: number | string, arg2: number | string, arg3: number | string) => arg3, {
    args: [new Arguments(1, 2, 3), new Arguments('a', 'b', 'c')],
});
benchmark.run();
