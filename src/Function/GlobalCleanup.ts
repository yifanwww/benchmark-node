export class GlobalCleanup {
    private declare _fn: () => void;

    public constructor(fn: () => void) {
        this._fn = fn;
    }

    public get fn() {
        return this._fn;
    }
}
