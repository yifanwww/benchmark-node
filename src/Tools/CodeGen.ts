import type { TestFn } from '../types';
import { Hrtime } from '../types.internal';

enum TesterContextEnum {
    TestFn = 'testFn',

    Args = 'args',
    RestArgs = 'restArgs',
    Ops = 'ops',
    Workload = 'workload',

    Setup = 'setup',
    Cleanup = 'cleanup',
}

export interface TesterContext {
    [TesterContextEnum.TestFn]: TestFn;

    [TesterContextEnum.Args]?: ReadonlyArray<unknown>;
    [TesterContextEnum.RestArgs]?: ReadonlyArray<unknown>;
    [TesterContextEnum.Ops]: number;
    [TesterContextEnum.Workload]: boolean;

    [TesterContextEnum.Setup]?: () => void;
    [TesterContextEnum.Cleanup]?: () => void;
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

    public static createTester = (options: CodeGenOptions) => new CodeGen(options).createTester();

    private declare readonly id: string;

    private declare readonly argument: CodeGenArgumentOptions;

    public constructor(options: CodeGenOptions) {
        CodeGen.cgid++;
        this.id = CodeGen.cgid.toString();

        this.argument = options.argument;
    }

    private generatePickArguments(): string {
        const code: string[] = [];

        for (let i = 0; i < this.argument.count; i++) {
            // No need to check `context#.${TesterContextEnum.Args}` exists or not.
            code.push(`const arg${i}_# = context#.${TesterContextEnum.Args}[${i}];`);
        }

        if (this.argument.rest) {
            // No need to check `context#.${TesterContextEnum.RestArgs}` exists or not.
            code.push(`const restArg# = context#.${TesterContextEnum.RestArgs};`);
        }

        return code.join('\n');
    }

    private generateTestFnCall(): string {
        const code: string[] = [];

        for (let i = 0; i < this.argument.count; i++) {
            code.push(`arg${i}_#`);
        }

        if (this.argument.rest) {
            code.push('restArg#');
        }

        return `testFn#(${code.join(', ')})`;
    }

    private interpolate = (str: string) => str.replace(/#/g, this.id);

    private removeEmptyLines(str: string) {
        return str
            .split('\n')
            .filter((value) => value !== '')
            .join('\n');
    }

    public createTester(): Tester {
        const body = this.removeEmptyLines(
            `
if (context#.${TesterContextEnum.Setup}) context#.${TesterContextEnum.Setup}();

const testFn# = context#.${TesterContextEnum.TestFn};
const workload# = context#.${TesterContextEnum.Workload};

${this.generatePickArguments()}

let return#;

const begin# = process.hrtime();
for (let i# = 0; i# < context#.${TesterContextEnum.Ops}; i#++) {
    if (workload#) {
        return# = ${this.generateTestFnCall()};
    } else {
        return# = undefined;
    }
}
const elapsed# = process.hrtime(begin#);

if (context#.${TesterContextEnum.Cleanup}) context#.${TesterContextEnum.Cleanup}();

return { elapsed: elapsed#, _internal_return: return# };
`,
        );

        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        return Function(this.interpolate('context#'), this.interpolate(body)) as Tester;
    }
}
