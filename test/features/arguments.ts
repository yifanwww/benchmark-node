import { Arguments, BenchmarkJob } from '../../src';

new BenchmarkJob()
    .add('test1', (_1: number, _2: number, arg: number) => arg, { args: [new Arguments(1, 2, 3)] })
    .add('test2', (_1: number | string, _2: number | string, arg: number | string) => arg, {
        args: [new Arguments(1, 2, 3), new Arguments('a', 'b', 'c')],
    })
    .run();
