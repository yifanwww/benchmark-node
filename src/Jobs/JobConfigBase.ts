import { BenchmarkRunner } from '../Task';

export class JobConfigBase {
    protected declare readonly _runner: BenchmarkRunner;

    protected constructor() {
        this._runner = new BenchmarkRunner();
    }
}
