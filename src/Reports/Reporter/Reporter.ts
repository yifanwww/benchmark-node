import type { BenchmarkResult } from './types';

export interface ReporterOptions {
    /**
     * Specifies whether to generate report with descriptions. Enabled by default.
     */
    description?: boolean;
    /**
     * Specifies whether to generate report with runtime info. Enabled by default.
     */
    runtime?: boolean;
}

export abstract class Reporter<R> {
    protected declare readonly _descriptionFlag: boolean;
    protected declare readonly _runtimeFlag: boolean;

    protected declare _report: R | null;

    constructor(options?: ReporterOptions) {
        this._descriptionFlag = options?.description ?? true;
        this._runtimeFlag = options?.runtime ?? true;

        this._report = null;
    }

    get report(): R | null {
        return this._report;
    }

    abstract generate(result: BenchmarkResult): this;
}
