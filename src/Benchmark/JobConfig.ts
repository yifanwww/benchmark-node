import { BenchmarkRunner } from './BenchmarkRunner';

import type { AnyFn, Optional } from '../types.internal';
import type { BenchmarkTask } from './BenchmarkTask';

export class JobConfig {
    private static id = 0;
    protected declare readonly _id: number;

    protected declare readonly _runner: BenchmarkRunner;

    protected declare _setup: Optional<AnyFn>;
    protected declare _cleanup: Optional<() => void>;

    protected constructor() {
        this._id = ++JobConfig.id;

        this._runner = new BenchmarkRunner();

        this._setup = null;
        this._cleanup = null;
    }

    protected run(task: BenchmarkTask): void {
        this._setup?.(...(task.params ?? []));

        this._runner.run(task);

        this._cleanup?.();
    }
}
