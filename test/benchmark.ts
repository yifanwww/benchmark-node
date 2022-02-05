import { Arguments, Benchmark } from '../src';

const benchmark = new Benchmark();
benchmark.setNoopTest();
benchmark.add('test1', () => {});
benchmark.add(function test2() {});
benchmark.add('test3', (arg1, arg2, arg3) => arg3, {
    args: [new Arguments(1, 2, 3), new Arguments('a', 'b', 'c')],
});
benchmark.run();
