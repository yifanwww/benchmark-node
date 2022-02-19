import { Time } from '../Tools/TimeTool';
import { BenchmarkSettings, Nanosecond } from '../types';

export class Settings {
    private _delay: Nanosecond;
    private _initOps: number;
    private _measurementCount: number;
    private _minMeasurementTime: Nanosecond;
    private _warmupCount: number;

    public constructor(settings: BenchmarkSettings) {
        const { delay = 5, initOps = 16, measurementCount = 15, minMeasurementTime = 250, warmupCount = 7 } = settings;

        this._delay = Time.ms2ns(delay);
        this._initOps = initOps;
        this._measurementCount = measurementCount;
        this._minMeasurementTime = Time.ms2ns(minMeasurementTime);
        this._warmupCount = warmupCount;
    }

    public get delay(): Nanosecond {
        return this._delay;
    }

    public get initOps(): number {
        return this._initOps;
    }

    public get measurementCount(): number {
        return this._measurementCount;
    }

    public get minMeasurementTime(): Nanosecond {
        return this._minMeasurementTime;
    }

    public get warmupCount(): number {
        return this._warmupCount;
    }
}
