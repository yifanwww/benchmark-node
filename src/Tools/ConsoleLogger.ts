import chalk from 'chalk';

export enum LogKind {
    Default,
    Header,
    Statistic,
    Info,
    Error,
}

type ColorScheme = {
    [key in LogKind]: (value: string) => string;
};

export class ConsoleLogger {
    static readonly default: ConsoleLogger = new ConsoleLogger();

    private declare readonly colorScheme: ColorScheme;

    constructor(colorScheme?: ColorScheme) {
        this.colorScheme = colorScheme ?? this.createColorfulScheme();
    }

    private createColorfulScheme(): ColorScheme {
        return {
            [LogKind.Default]: chalk.white,
            [LogKind.Header]: chalk.magentaBright,
            [LogKind.Statistic]: chalk.cyanBright,
            [LogKind.Info]: chalk.yellow,
            [LogKind.Error]: chalk.red,
        };
    }

    private _writeImpl(text: string) {
        return process.stdout.write(text);
    }

    private _writeLineImpl(text?: string) {
        return process.stdout.write(text ? `${text}\n` : '\n');
    }

    private _write(kind: LogKind, write: (text: string) => void, text: string) {
        write(this.colorScheme[kind](text));
    }

    write(text: string): void;
    write(kind: LogKind, text: string): void;

    write(...args: [string] | [LogKind, string]) {
        if (args.length === 1) {
            this._write(LogKind.Default, this._writeImpl, args[0]);
        } else {
            this._write(args[0], this._writeImpl, args[1]);
        }
    }

    writeLine(): void;
    writeLine(text: string): void;
    writeLine(kind: LogKind, text: string): void;

    writeLine(...args: [] | [string] | [LogKind, string]) {
        if (args.length === 0) {
            this._writeLineImpl();
        } else if (args.length === 1) {
            this._write(LogKind.Default, this._writeLineImpl, args[0]);
        } else {
            this._write(args[0], this._writeLineImpl, args[1]);
        }
    }

    writeHeader(text: string) {
        return this.write(LogKind.Header, text);
    }

    writeStatistic(text: string) {
        return this.write(LogKind.Statistic, text);
    }

    writeInfo(text: string) {
        return this.write(LogKind.Info, text);
    }

    writeError(text: string) {
        return this.write(LogKind.Error, text);
    }

    writeLineHeader(text: string) {
        return this.writeLine(LogKind.Header, text);
    }

    writeLineStatistic(text: string) {
        return this.writeLine(LogKind.Statistic, text);
    }

    writeLineInfo(text: string) {
        return this.writeLine(LogKind.Info, text);
    }

    writeLineError(text: string) {
        return this.writeLine(LogKind.Error, text);
    }
}
