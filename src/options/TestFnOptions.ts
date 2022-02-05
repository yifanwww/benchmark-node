import { Arguments } from '../ConfigOptions';
import { BenchmarkJobTestFnOptions } from '../types';

export class TestFnOptions {
    private _argsArr: ReadonlyArray<Arguments>;
    private _argsLength: number;

    private _jitArgsArr: ReadonlyArray<Arguments>;
    private _jitArgsLength: number;

    private _maxArgsLength: number;

    constructor(options: BenchmarkJobTestFnOptions) {
        const { args = [], jitArgs: preArgs = [] } = options;

        this._argsArr = Array.isArray(args) ? args : [args];
        const jitArgsArr = Array.isArray(preArgs) ? preArgs : [preArgs];
        this._jitArgsArr = [...jitArgsArr, ...this._argsArr];

        this._argsLength = this.getArgsLength(this._argsArr);
        this._jitArgsLength = this.getArgsLength(this._jitArgsArr);

        this._maxArgsLength = Math.max(this._argsLength, this._jitArgsLength);
    }

    private getArgsLength(argsArr: ReadonlyArray<Arguments>): number {
        let max = 0;
        for (const args of argsArr) {
            max = Math.max(max, args.args.length);
        }
        return max;
    }

    private *getEnumerator(argsArr: ReadonlyArray<Arguments>) {
        for (const args of argsArr) {
            yield args;
        }
    }

    public get args(): Generator<Arguments, void> {
        return this.getEnumerator(this._argsArr);
    }

    public get argsCount(): number {
        return this._argsArr.length;
    }

    public get argsLength(): number {
        return this._argsLength;
    }

    public get jitArgs(): Generator<Arguments, void> {
        return this.getEnumerator(this._jitArgsArr);
    }

    public get jitArgsCount(): number {
        return this._jitArgsArr.length;
    }

    public get jitArgsLength(): number {
        return this._jitArgsLength;
    }

    public get maxArgsLength(): number {
        return this._maxArgsLength;
    }
}
