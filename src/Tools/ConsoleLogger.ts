import chalk from 'chalk';

export enum LogKind {
    DEFAULT,
    HEADER,
    STATISTIC,
    INFO,
    ERROR,
}

type ColorScheme = {
    [key in LogKind]: (value: string) => string;
};

export class ConsoleLogger {
    static readonly default: ConsoleLogger = new ConsoleLogger();

    private declare readonly _colorScheme: ColorScheme;

    constructor(colorScheme?: ColorScheme) {
        this._colorScheme = colorScheme ?? this._createColorfulScheme();
    }

    private _createColorfulScheme(): ColorScheme {
        return {
            [LogKind.DEFAULT]: chalk.white,
            [LogKind.HEADER]: chalk.magentaBright,
            [LogKind.STATISTIC]: chalk.cyanBright,
            [LogKind.INFO]: chalk.yellow,
            [LogKind.ERROR]: chalk.red,
        };
    }

    private _writeImpl(text: string) {
        return process.stdout.write(text);
    }

    private _writeLineImpl(text?: string) {
        return process.stdout.write(text ? `${text}\n` : '\n');
    }

    private _write(kind: LogKind, write: (text: string) => void, text: string) {
        write(this._colorScheme[kind](text));
    }

    write(text: string): void;
    write(kind: LogKind, text: string): void;

    write(...args: [string] | [LogKind, string]) {
        if (args.length === 1) {
            this._write(LogKind.DEFAULT, this._writeImpl, args[0]);
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
            this._write(LogKind.DEFAULT, this._writeLineImpl, args[0]);
        } else {
            this._write(args[0], this._writeLineImpl, args[1]);
        }
    }

    writeHeader(text: string) {
        return this.write(LogKind.HEADER, text);
    }

    writeStatistic(text: string) {
        return this.write(LogKind.STATISTIC, text);
    }

    writeInfo(text: string) {
        return this.write(LogKind.INFO, text);
    }

    writeError(text: string) {
        return this.write(LogKind.ERROR, text);
    }

    writeLineHeader(text: string) {
        return this.writeLine(LogKind.HEADER, text);
    }

    writeLineStatistic(text: string) {
        return this.writeLine(LogKind.STATISTIC, text);
    }

    writeLineInfo(text: string) {
        return this.writeLine(LogKind.INFO, text);
    }

    writeLineError(text: string) {
        return this.writeLine(LogKind.ERROR, text);
    }
}
