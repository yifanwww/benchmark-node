export class Arguments<Args extends readonly unknown[] = readonly unknown[]> {
    private declare readonly _args: Args;

    constructor(...args: Args) {
        this._args = args;
    }

    get args() {
        return this._args;
    }
}
