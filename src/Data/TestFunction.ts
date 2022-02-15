import { Arguments } from '../Parameterization';
import { BenchmarkJobTestFnOptions, TestFn } from '../types';
import { Optional } from '../types.internal';

export class TestFunction<T extends TestFn> {
    private _fn: T;

    private _argNames: Optional<string[]> = null;

    public get fn() {
        return this._fn;
    }

    public get argNames() {
        return this._argNames;
    }

    private _argsArr: ReadonlyArray<Arguments<Parameters<T>>>;
    private _argsLength: number;

    private _jitArgsArr: ReadonlyArray<Arguments<Parameters<T>>>;
    private _jitArgsLength: number;

    private _maxArgsLength: number;

    private _setup?: () => void;
    private _cleanup?: () => void;

    public get setup() {
        return this._setup;
    }

    public get cleanup() {
        return this._cleanup;
    }

    public constructor(testFn: T, options: BenchmarkJobTestFnOptions<T>) {
        this._fn = testFn;

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

    private static functionExpression = /^(?:function(?:\s?[^(]+)?)?\(\s*([^)]*\s*)\)/i;
    private static delimiterExpression = /,\s*/i;

    // TODO: Maybe can display the argument names in Performance Table.
    private static getArgumentNames<T extends TestFn>(fn: T): string[] {
        const matching = TestFunction.functionExpression.exec(fn.toString());

        if (matching) {
            const group = matching[1];
            return (
                group
                    // Split the arguments string into an array comma-like delimited.
                    .split(TestFunction.delimiterExpression)
                    // Ensure no default value and trim the whitespace.
                    .map((arg) => arg.replace(/=[\w\W]*/, '').trim())
                    // Ensure no inline comments are parsed and trim the whitespace.
                    .map((arg) => arg.replace(/\/\*.*\*\//g, '').trim())
                    // Ensure no undefined values are added.
                    .filter((arg) => arg)
            );
        }

        return [];
    }
}
