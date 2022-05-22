import { BenchmarkRunner } from './BenchmarkRunner';

export class JobConfigBase {
    private static id = 0;
    protected declare readonly _id: number;

    protected declare readonly _runner: BenchmarkRunner;

    protected constructor() {
        this._id = ++JobConfigBase.id;

        this._runner = new BenchmarkRunner();
    }
}
