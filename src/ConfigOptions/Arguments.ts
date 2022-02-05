export class Arguments {
    private _args: ReadonlyArray<unknown>;

    public constructor(...args: ReadonlyArray<unknown>) {
        this._args = args;
    }

    public get args() {
        return this._args;
    }
}
