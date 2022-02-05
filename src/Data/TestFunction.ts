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

    private static functionExpression = /^(?:function(?:\s?[^(]+)?)?\(\s*([^)]*\s*)\)/i;
    private static delimiterExpression = /,\s*/i;

    // TODO: Maybe can display the argument names in Performance Table.
    private static getArgumentNames(fn: TestFn): string[] {
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
