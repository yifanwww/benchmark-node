import type { TestFn } from '../types';
import type { Optional } from '../types.internal';

export interface BenchmarkContext {
    readonly name: string;

    readonly testFn: TestFn;
    readonly testFnParamNames: readonly string[];

    readonly setup: Optional<() => void>;
    readonly cleanup: Optional<() => void>;
}
