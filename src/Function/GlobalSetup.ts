import { Params } from '../Parameterization';
import { Optional } from '../types.internal';
import { FunctionInfo } from './FunctionInfo';

export class GlobalSetup {
    static EMPTY = new GlobalSetup(null, []);

    private declare _fn: Optional<(...args: readonly unknown[]) => void>;
    private declare _paramNames: readonly string[];
    private declare _params: readonly Params[];

    constructor(fn: Optional<(...args: unknown[]) => void>, params: readonly Params[]) {
        this._fn = fn;
        this._paramNames = fn ? FunctionInfo.getParameterNames(fn) : [];
        this._params = params;
    }

    get fn() {
        return this._fn;
    }

    get paramNames() {
        return this._paramNames;
    }

    get params() {
        return this._params;
    }
}
