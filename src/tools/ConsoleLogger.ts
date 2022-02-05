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
    public static readonly default: ConsoleLogger = new ConsoleLogger();

    private colorScheme: ColorScheme;

    public constructor(colorScheme?: ColorScheme) {
        this.colorScheme = colorScheme ?? this.createColorfulScheme();
    }

    private createColorfulScheme = (): ColorScheme => ({
        [LogKind.Default]: chalk.white,
        [LogKind.Header]: chalk.magentaBright,
        [LogKind.Statistic]: chalk.cyanBright,
        [LogKind.Info]: chalk.yellow,
        [LogKind.Error]: chalk.red,
    });

    private _writeImpl = (text: string) => process.stdout.write(text);
    private _writeLineImpl = (text?: string) => process.stdout.write(text ? `${text}\n` : '\n');

    public write(text: string): void;
    public write(kind: LogKind, text: string): void;

    public write(...args: [string] | [LogKind, string]) {
        if (args.length === 1) {
            this._write(LogKind.Default, this._writeImpl, args[0]);
        } else {
            this._write(args[0], this._writeImpl, args[1]);
        }
    }

    public writeLine(): void;
    public writeLine(text: string): void;
    public writeLine(kind: LogKind, text: string): void;

    public writeLine(...args: [] | [string] | [LogKind, string]) {
        if (args.length === 0) {
            this._writeLineImpl();
        } else if (args.length === 1) {
            this._write(LogKind.Default, this._writeLineImpl, args[0]);
        } else {
            this._write(args[0], this._writeLineImpl, args[1]);
        }
    }

    private _write(kind: LogKind, write: (text: string) => void, text: string) {
        write(this.colorScheme[kind](text));
    }

    public writeHeader = (text: string) => this.write(LogKind.Header, text);
    public writeStatistic = (text: string) => this.write(LogKind.Statistic, text);
    public writeInfo = (text: string) => this.write(LogKind.Info, text);
    public writeError = (text: string) => this.write(LogKind.Error, text);

    public writeLineHeader = (text: string) => this.writeLine(LogKind.Header, text);
    public writeLineStatistic = (text: string) => this.writeLine(LogKind.Statistic, text);
    public writeLineInfo = (text: string) => this.writeLine(LogKind.Info, text);
    public writeLineError = (text: string) => this.writeLine(LogKind.Error, text);
}
