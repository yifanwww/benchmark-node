export class FunctionInfo {
    static readonly ANONYMOUS_NAME = 'anonymous';

    static getFunctionName(fn: Function): string {
        return fn.name || FunctionInfo.ANONYMOUS_NAME;
    }

    private static readonly _FUNCTION_EXPRESSION = /^(?:function(?:\s?[^(]+)?)?\(\s*([^)]*\s*)\)/i;
    private static readonly _DELIMITER_EXPRESSION = /,\s*/i;

    static getParameterNames(fn: Function): string[] {
        const fnStr = fn.toString();

        const matching = FunctionInfo._FUNCTION_EXPRESSION.exec(fnStr);
        if (!matching) {
            throw new Error(`Failed to get the function names, fn: ${fnStr}`);
        }

        const group = matching[1];
        return (
            group
                // Split the arguments string into an array comma-like delimited.
                .split(FunctionInfo._DELIMITER_EXPRESSION)
                // Ensure no default value and trim the whitespace.
                .map((arg) => arg.replace(/=[\w\W]*/, '').trim())
                // Ensure no inline comments are parsed and trim the whitespace.
                .map((arg) => arg.replace(/\/\*.*\*\//g, '').trim())
                // Ensure no undefined values are added.
                .filter((arg) => arg)
        );
    }
}
