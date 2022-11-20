import type { BenchmarkResult } from './types';

export interface ReportOptions {
    /**
     * Specifies whether to generate report with descriptions. Enabled by default.
     */
    description?: boolean;
    /**
     * Specifies whether to generate report with runtime info. Enabled by default.
     */
    runtime?: boolean;
}

export abstract class Report<R> {
    protected declare readonly descriptionFlag: boolean;
    protected declare readonly runtimeFlag: boolean;

    protected declare _report: R | null;

    constructor(options?: ReportOptions) {
        this.descriptionFlag = options?.description ?? true;
        this.runtimeFlag = options?.runtime ?? true;

        this._report = null;
    }

    get report(): R | null {
        return this._report;
    }

    abstract generate(result: BenchmarkResult): this;
}
