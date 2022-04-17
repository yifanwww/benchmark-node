export class FunctionInfo {
    public static ANONYMOUS_NAME = 'anonymous';

    public static getFunctionName(fn: Function): string {
        return fn.name || FunctionInfo.ANONYMOUS_NAME;
    }

    private static FUNCTION_EXPRESSION = /^(?:function(?:\s?[^(]+)?)?\(\s*([^)]*\s*)\)/i;
    private static DELIMITER_EXPRESSION = /,\s*/i;

    public static getParameterNames(fn: Function): string[] {
        const matching = FunctionInfo.FUNCTION_EXPRESSION.exec(fn.toString());
        if (!matching) {
            throw new Error(`Failed to get the function names, fn: ${fn}`);
        }

        const group = matching[1];
        return (
            group
                // Split the arguments string into an array comma-like delimited.
                .split(FunctionInfo.DELIMITER_EXPRESSION)
                // Ensure no default value and trim the whitespace.
                .map((arg) => arg.replace(/=[\w\W]*/, '').trim())
                // Ensure no inline comments are parsed and trim the whitespace.
                .map((arg) => arg.replace(/\/\*.*\*\//g, '').trim())
                // Ensure no undefined values are added.
                .filter((arg) => arg)
        );
    }
}
