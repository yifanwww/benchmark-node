import { Stats } from '../Data';
import { Formatter, TimeTool, TimeUnit, TimeUnitStr } from '../tools';

import { Column, GetData } from './Column';

export enum PerfColumnType {
    Mean = 'Mean',
    StdErr = 'StdErr',
    StdDev = 'StdDev',
    Median = 'Median',
    Min = 'Min',
    Max = 'Max',
}

export class PerfColumn extends Column<number> {
    private _type: PerfColumnType;

    private _unit: TimeUnit = TimeUnit.NS;
    private _fractionDigit: number = 4;

    public get type() {
        return this._type;
    }

    public setUnit(value: TimeUnit): void {
        this._unit = value;
    }

    public constructor(type: PerfColumnType, getData: GetData<number>) {
        super(type, getData);

        this._type = type;
    }

    protected override getDataWrapper(stats: Stats): string {
        const data = TimeTool.convert(this._getData!(stats), TimeUnit.NS, this._unit);
        return `${Formatter.beautifyNumber(data.toFixed(this._fractionDigit))} ${TimeUnitStr[this._unit]}`;
    }

    public findMinTimeUnit(stats: Stats[]): TimeUnit {
        let min = Number.MAX_SAFE_INTEGER;

        for (const _stats of stats) {
            const data = this._getData!(_stats);
            min = Math.min(min, data);
        }

        if (min <= 1e3) {
            return TimeUnit.NS;
        } else if (min <= 1e6) {
            return TimeUnit.US;
        } else if (min <= 1e9) {
            return TimeUnit.MS;
        } else {
            return TimeUnit.S;
        }
    }

    public findFractionDigit(stats: Stats[]): void {
        let min = Number.MAX_SAFE_INTEGER;

        for (const _stats of stats) {
            const data = TimeTool.convert(this._getData!(_stats), TimeUnit.NS, this._unit);
            min = Math.min(min, data);
        }
    }
}
