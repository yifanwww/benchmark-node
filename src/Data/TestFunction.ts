import { TestFn } from '../types';

export class TestFunction {
    private _fn: TestFn;

    private _argNames: Optional<string[]> = null;

    public get fn() {
        return this._fn;
    }

    public get argNames() {
        return this._argNames;
    }

    public constructor(testFn: TestFn) {
        this._fn = testFn;
    }
}
