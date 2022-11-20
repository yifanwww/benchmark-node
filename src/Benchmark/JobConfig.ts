import type { AnyFn, Optional } from '../types.internal';

import { BenchmarkRunner } from './BenchmarkRunner';
import type { BenchmarkTask } from './BenchmarkTask';

export class JobConfig {
    private static _staticId = 0;
    protected declare readonly _id: number;

    protected declare readonly _runner: BenchmarkRunner;

    protected declare _setup: Optional<AnyFn>;
    protected declare _cleanup: Optional<() => void>;

    protected constructor() {
        this._id = ++JobConfig._staticId;

        this._runner = new BenchmarkRunner();

        this._setup = null;
        this._cleanup = null;
    }

    run(task: BenchmarkTask): void {
        this._setup?.(...(task.params ?? []));

        this._runner.run(task);

        this._cleanup?.();
    }
}
