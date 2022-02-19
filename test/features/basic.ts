import { BenchmarkJob } from '../../src';

new BenchmarkJob()
    .add('test1', () => {})
    .add(function test2() {})
    .run();
