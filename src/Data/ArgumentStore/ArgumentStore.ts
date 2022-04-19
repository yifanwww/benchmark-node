import { Arguments } from '../../Parameterization/Arguments';
import { range } from '../../Tools/range';
import { LooseReadonlyArray } from '../../types';
import { ArgumentStoreView } from './ArgumentStoreView';

export class ArgumentStore {
    private declare _argsList: readonly Arguments[];
    private declare _jitArgsList: readonly Arguments[];

    private declare _maxArgsLength: number;

    get argsList() {
        return this._argsList;
    }

    get jitArgsList() {
        return this._jitArgsList;
    }

    get maxArgsLength() {
        return this._maxArgsLength;
    }

    constructor(argsList: LooseReadonlyArray<Arguments> = [], jitArgsList: LooseReadonlyArray<Arguments> = []) {
        this._argsList = Array.isArray(argsList) ? argsList : [argsList];
        this._jitArgsList = [...(Array.isArray(jitArgsList) ? jitArgsList : [jitArgsList]), ...this._argsList];

        this._maxArgsLength = Math.max(this.getArgsLength(this._argsList), this.getArgsLength(this._jitArgsList));
    }

    private getArgsLength(argsArr: ReadonlyArray<Arguments>): number {
        let max = 0;
        for (const args of argsArr) {
            max = Math.max(max, args.args.length);
        }
        return max;
    }

    *getViewEnumerator(): Generator<ArgumentStoreView, void> {
        if (this._argsList.length === 0) {
            yield new ArgumentStoreView(this, null);
        } else {
            for (const index of range(0, this._argsList.length)) {
                yield new ArgumentStoreView(this, index);
            }
        }
    }
}
