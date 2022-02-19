import { Benchmark } from '../../src';

new Benchmark()
    .add('test1', () => {})
    .add(function test2() {})
    .run();
