import { TestFn } from '../types';
import { Hrtime, _Arguments } from '../types.internal';

export interface TesterContext {
    args?: _Arguments;
    ops: number;
    restArgs?: _Arguments;
    setup?: () => void;
    teardown?: () => void;
    testFn: TestFn;
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

    private id: string;

    private argument: CodeGenArgumentOptions;

    public constructor(options: CodeGenOptions) {
        CodeGen.cgid++;
        this.id = CodeGen.cgid.toString();

        this.argument = options.argument;
    }

    private generatePickArguments(): string {
        const code: string[] = [];

        for (let i = 0; i < this.argument.count; i++) {
            code.push(`const arg${i}_# = context#.args[${i}];`);
        }

        if (this.argument.rest) {
            code.push('const restArg# = context#.restArgs;');
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
context#.setup?.();

const testFn# = context#.testFn;

${this.generatePickArguments()}

let return#;

const begin# = process.hrtime();
for (let i# = 0; i# < context#.ops; i#++) {
return# = ${this.generateTestFnCall()};
}
const elapsed# = process.hrtime(begin#);

context#.teardown?.();

return { elapsed: elapsed#, _internal_return: return# };
`,
        );

        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        return Function(this.interpolate('context#'), this.interpolate(body)) as Tester;
    }
}
