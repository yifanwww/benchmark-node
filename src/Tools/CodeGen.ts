import type { TestFn } from '../types';
import type { Hrtime, Optional } from '../types.internal';

enum TesterContextEnum {
    TEST_FN = 'testFn',

    ARGS = 'args',
    REST_ARGS = 'restArgs',
    OPS = 'ops',
    WORKLOAD = 'workload',

    SETUP = 'setup',
    CLEANUP = 'cleanup',
}

export interface TesterContext {
    [TesterContextEnum.TEST_FN]: TestFn;

    [TesterContextEnum.ARGS]?: ReadonlyArray<unknown>;
    [TesterContextEnum.REST_ARGS]?: ReadonlyArray<unknown>;
    [TesterContextEnum.OPS]: number;
    [TesterContextEnum.WORKLOAD]: boolean;

    [TesterContextEnum.SETUP]: Optional<() => void>;
    [TesterContextEnum.CLEANUP]: Optional<() => void>;
}

export type Tester = (context: TesterContext) => { elapsed: Hrtime };

export interface CodeGenArgumentOptions {
    count: number;
    rest?: boolean;
}

export interface CodeGenOptions {
    argument: CodeGenArgumentOptions;
}

export class CodeGen {
    private static cgid: number = 0;

    static createTester(options: CodeGenOptions) {
        return new CodeGen(options).createTester();
    }

    private declare readonly id: string;

    private declare readonly argument: CodeGenArgumentOptions;

    constructor(options: CodeGenOptions) {
        CodeGen.cgid++;
        this.id = CodeGen.cgid.toString();

        this.argument = options.argument;
    }

    private generatePickArguments(): string {
        const code: string[] = [];

        for (let i = 0; i < this.argument.count; i++) {
            // No need to check `context#.${TesterContextEnum.Args}` exists or not.
            code.push(`const arg${i}_# = context#.${TesterContextEnum.ARGS}[${i}];`);
        }

        if (this.argument.rest) {
            // No need to check `context#.${TesterContextEnum.RestArgs}` exists or not.
            code.push(`const restArg# = context#.${TesterContextEnum.REST_ARGS};`);
        }

        return code.join('\n');
    }

    private generateTestFnCall(): string {
        const code: string[] = [];

        for (let i = 0; i < this.argument.count; i++) {
            code.push(`arg${i}_#`);
        }

        if (this.argument.rest) {
            code.push('...restArg#');
        }

        return `testFn#(${code.join(', ')})`;
    }

    private interpolate(str: string) {
        return str.replace(/#/g, this.id);
    }

    private removeEmptyLines(str: string) {
        return str
            .split('\n')
            .filter((value) => value !== '')
            .join('\n');
    }

    createTester(): Tester {
        const body = this.removeEmptyLines(
            `
if (context#.${TesterContextEnum.SETUP}) context#.${TesterContextEnum.SETUP}();

const testFn# = context#.${TesterContextEnum.TEST_FN};
const workload# = context#.${TesterContextEnum.WORKLOAD};

${this.generatePickArguments()}

let return#;

const begin# = process.hrtime();
for (let i# = 0; i# < context#.${TesterContextEnum.OPS}; i#++) {
    if (workload#) {
        return# = ${this.generateTestFnCall()};
    } else {
        return# = undefined;
    }
}
const elapsed# = process.hrtime(begin#);

if (context#.${TesterContextEnum.CLEANUP}) context#.${TesterContextEnum.CLEANUP}();

return { elapsed: elapsed#, _internal_return: return# };
`,
        );

        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        return Function(this.interpolate('context#'), this.interpolate(body)) as Tester;
    }
}
