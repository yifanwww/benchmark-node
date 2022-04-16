import { Arguments } from '../Parameterization';
import { BenchmarkTestFnOptions, TestFn } from '../types';
import { Optional } from '../types.internal';

export class TestFunction<T extends TestFn> {
    private declare readonly _fn: T;

    private declare readonly _argNames: Optional<string[]>;

    /** The testFn. */
    public get fn() {
        return this._fn;
    }

    public get argNames() {
        return this._argNames;
    }

    private declare readonly _argsArr: ReadonlyArray<Arguments<Parameters<T>>>;
    private declare readonly _argsLength: number;

    private declare readonly _jitArgsArr: ReadonlyArray<Arguments<Parameters<T>>>;
    private declare readonly _jitArgsLength: number;

    private declare readonly _maxArgsLength: number;

    private declare readonly _setup?: () => void;
    private declare readonly _cleanup?: () => void;

    public get setup() {
        return this._setup;
    }

    public get cleanup() {
        return this._cleanup;
    }

    public constructor(testFn: T, options: BenchmarkTestFnOptions<T>) {
        this._fn = testFn;

        this._argNames = null;

        const { args = [], cleanup, jitArgs: preArgs = [], setup } = options;

        this._argsArr = Array.isArray(args) ? args : [args];
        const jitArgsArr = Array.isArray(preArgs) ? preArgs : [preArgs];
        this._jitArgsArr = [...jitArgsArr, ...this._argsArr];

        this._argsLength = this.getArgsLength(this._argsArr);
        this._jitArgsLength = this.getArgsLength(this._jitArgsArr);

        this._maxArgsLength = Math.max(this._argsLength, this._jitArgsLength);

        this._setup = setup;
        this._cleanup = cleanup;
    }

    private getArgsLength(argsArr: ReadonlyArray<Arguments<Parameters<T>>>): number {
        let max = 0;
        for (const args of argsArr) {
            max = Math.max(max, args.args.length);
        }
        return max;
    }

    private *getEnumerator(argsArr: ReadonlyArray<Arguments<Parameters<T>>>) {
        for (const args of argsArr) {
            yield args;
        }
    }

    public getJitArgsGenerator = () => this.getEnumerator(this._jitArgsArr);

    public get args(): Generator<Arguments<Parameters<T>>, void> {
        return this.getEnumerator(this._argsArr);
    }

    public get argsCount(): number {
        return this._argsArr.length;
    }

    public get argsLength(): number {
        return this._argsLength;
    }

    public get jitArgs(): Generator<Arguments<Parameters<T>>, void> {
        return this.getJitArgsGenerator();
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
