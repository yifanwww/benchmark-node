import { ANONYMOUS_FN_NAME } from '../constants';

export class FunctionInfo {
    private declare _name: string;
    private declare _paramNames: string[];

    public get name() {
        return this._name;
    }

    public get paramNames() {
        return this._paramNames;
    }

    public constructor(fn: Function) {
        this._name = fn.name || ANONYMOUS_FN_NAME;
        this._paramNames = FunctionInfo.getParameterNames(fn);
    }

    private static functionExpression = /^(?:function(?:\s?[^(]+)?)?\(\s*([^)]*\s*)\)/i;
    private static delimiterExpression = /,\s*/i;

    private static getParameterNames(fn: Function): string[] {
        const matching = FunctionInfo.functionExpression.exec(fn.toString());
        if (!matching) {
            throw new Error(`Failed to get the function names, fn: ${fn}`);
        }

        const group = matching[1];
        return (
            group
                // Split the arguments string into an array comma-like delimited.
                .split(FunctionInfo.delimiterExpression)
                // Ensure no default value and trim the whitespace.
                .map((arg) => arg.replace(/=[\w\W]*/, '').trim())
                // Ensure no inline comments are parsed and trim the whitespace.
                .map((arg) => arg.replace(/\/\*.*\*\//g, '').trim())
                // Ensure no undefined values are added.
                .filter((arg) => arg)
        );
    }
}
