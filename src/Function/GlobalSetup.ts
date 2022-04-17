import { Params } from '../Parameterization';
import { MultiIndexIterator } from '../Tools/MultiIndexIterator';
import { FunctionInfo } from './FunctionInfo';
import { GlobalSetupView } from './GlobalSetupView';

export class GlobalSetup {
    private declare _fn: (...args: readonly unknown[]) => void;
    private declare _paramNames: readonly string[];
    private declare _params: readonly Params<unknown>[];

    public constructor(fn: (...args: unknown[]) => void, params: readonly Params<unknown>[]) {
        this._fn = fn;
        this._paramNames = FunctionInfo.getParameterNames(fn);
        this._params = params;
    }

    public get fn() {
        return this._fn;
    }

    public get paramNames() {
        return this._paramNames;
    }

    public get params() {
        return this._params;
    }

    public hasParams(): boolean {
        return this._params.length > 0;
    }

    public *getViewEnumerator(): Generator<GlobalSetupView, void> {
        const iter = new MultiIndexIterator(this._params.map((param) => param.values.length));
        for (const indexes of iter) {
            yield new GlobalSetupView(this, indexes);
        }
    }
}
