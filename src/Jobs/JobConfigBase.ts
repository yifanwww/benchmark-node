import { BenchmarkRunner } from '../BenchmarkRunner';

export class JobConfigBase {
    protected declare readonly _runner: BenchmarkRunner;

    protected constructor() {
        this._runner = new BenchmarkRunner();
    }
}
