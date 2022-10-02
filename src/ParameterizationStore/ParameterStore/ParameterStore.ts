import type { Params } from '../../Parameterization';
import type { Optional } from '../../types.internal';

export class ParameterStore {
    private declare readonly _names: readonly string[];
    private declare readonly _params: readonly Params[];

    private declare readonly _count: number;

    get count() {
        return this._count;
    }

    get names() {
        return this._names;
    }

    constructor(params: readonly Params[], names: readonly string[]) {
        this._names = names;
        this._params = params;

        this._count = params.length === 0 ? 0 : params.reduce((prev, curr) => prev * curr.values.length, 1);
    }

    hasParams(): boolean {
        return this._count !== 0;
    }

    getParams(index: number): Optional<readonly unknown[]> {
        if (!this.hasParams()) return null;

        const realParams: unknown[] = [];

        let num = index;
        for (let i = this._params.length - 1; i >= 0; i--) {
            const len = this._params[i].values.length;
            realParams.push(this._params[i].values[num % len]);
            num = Math.floor(num / len);
        }

        return realParams.reverse();
    }
}
