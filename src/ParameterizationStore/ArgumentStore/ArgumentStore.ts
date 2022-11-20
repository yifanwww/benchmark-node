import type { Arguments } from '../../Parameterization';
import type { LooseArray } from '../../types';

export class ArgumentStore {
    private declare _argsList: readonly Arguments[];
    private declare _jitArgsList: readonly Arguments[];

    private declare _argsLength: number;
    private declare _maxArgsLength: number;

    get argsList() {
        return this._argsList;
    }

    get jitArgsList() {
        return this._jitArgsList;
    }

    get argsLength() {
        return this._argsLength;
    }

    get maxArgsLength() {
        return this._maxArgsLength;
    }

    constructor(argsList: LooseArray<Arguments> = [], jitArgsList: LooseArray<Arguments> = []) {
        this._argsList = Array.isArray(argsList) ? argsList : [argsList];
        this._jitArgsList = [...(Array.isArray(jitArgsList) ? jitArgsList : [jitArgsList]), ...this._argsList];

        this._argsLength = this._getArgsLength(this._argsList);
        this._maxArgsLength = Math.max(this._argsLength, this._getArgsLength(this._jitArgsList));
    }

    private _getArgsLength(argsArr: readonly Arguments[]): number {
        let max = 0;
        for (const args of argsArr) {
            max = Math.max(max, args.args.length);
        }
        return max;
    }
}
