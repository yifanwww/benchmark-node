import { BenchmarkJob } from '../../src';

new BenchmarkJob()
    .addSetup(() => {})
    .addSetup(() => {})
    .addCleanup(() => {})
    .addCleanup(() => {})
    .add('', () => {})
    // eslint-disable-next-line func-names
    .add(function () {})
    .add(() => {})
    .run();
