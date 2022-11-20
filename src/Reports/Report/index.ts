export interface ReportOptions {
    /**
     * Generate the report with descriptions. Enabled by default.
     */
    description?: boolean;
}

export abstract class Report<R> {
    protected declare readonly _description: boolean;

    protected declare _report: R | null;

    constructor(options?: ReportOptions) {
        this._description = options?.description ?? true;

        this._report = null;
    }

    get report(): R | null {
        return this._report;
    }

    // TODO: should receive a json object which contains all the data this report needs.
    abstract generate(): this;
}
