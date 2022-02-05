export class Arguments {
    private _args: unknown[];

    public constructor(...args: unknown[]) {
        this._args = args;
    }

    public get args() {
        return this._args;
    }
}
