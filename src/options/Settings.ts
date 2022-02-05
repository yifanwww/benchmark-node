import { Time } from '../tools/TimeTool';
import { BenchmarkJobSettings } from '../types';
import { _Nanosecond } from '../types.internal';

export class Settings {
    private _delay: _Nanosecond;
    private _initOps: number;
    private _measurementCount: number;
    private _minMeasurementTime: _Nanosecond;

    public constructor(settings: BenchmarkJobSettings) {
        const { delay = 5, initOps = 16, measurementCount = 15, minMeasurementTime = 100 } = settings;

        this._delay = Time.ms2ns(delay);
        this._initOps = initOps;
        this._measurementCount = measurementCount;
        this._minMeasurementTime = Time.ms2ns(minMeasurementTime);
    }

    public get delay(): _Nanosecond {
        return this._delay;
    }

    public get initOps(): number {
        return this._initOps;
    }

    public get measurementCount(): number {
        return this._measurementCount;
    }

    public get minMeasurementTime(): _Nanosecond {
        return this._minMeasurementTime;
    }
}
