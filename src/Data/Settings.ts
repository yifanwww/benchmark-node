import { Time } from '../Tools/TimeTool';
import { BenchmarkingSettings, Nanosecond } from '../types';

export class Settings {
    private static readonly defaultValue: Required<BenchmarkingSettings> = {
        delay: 5,
        initOps: 16,
        measurementCount: 15,
        minMeasurementTime: 250,
        warmupCount: 7,
    };
    private static readonly mimimumValue: Required<BenchmarkingSettings> = {
        delay: 1,
        initOps: 1,
        measurementCount: 3,
        minMeasurementTime: 1,
        warmupCount: 1,
    };

    private _origin: BenchmarkingSettings;

    private _delay: Nanosecond;
    private _initOps: number;
    private _measurementCount: number;
    private _minMeasurementTime: Nanosecond;
    private _warmupCount: number;

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

    public constructor(settings: BenchmarkingSettings) {
        const { delay, initOps, measurementCount, minMeasurementTime, warmupCount } = settings;

        this._origin = {
            delay,
            initOps,
            measurementCount,
            minMeasurementTime,
            warmupCount,
        };

        this._delay = Time.ms2ns(Math.max(Settings.mimimumValue.delay, delay ?? Settings.defaultValue.delay));
        this._initOps = Math.max(Settings.mimimumValue.initOps, initOps ?? Settings.defaultValue.initOps);
        this._measurementCount = Math.max(
            Settings.mimimumValue.measurementCount,
            measurementCount ?? Settings.defaultValue.measurementCount,
        );
        this._minMeasurementTime = Time.ms2ns(
            Math.max(
                Settings.mimimumValue.minMeasurementTime,
                minMeasurementTime ?? Settings.defaultValue.minMeasurementTime,
            ),
        );
        this._warmupCount = Math.max(
            Settings.mimimumValue.warmupCount,
            warmupCount ?? Settings.defaultValue.warmupCount,
        );
    }

    public setButNoOverwriting(settings: BenchmarkingSettings): void {
        const { delay, initOps, measurementCount, minMeasurementTime, warmupCount } = settings;

        if (this._origin.delay === undefined && delay !== undefined) {
            this._delay = Time.ms2ns(Math.max(Settings.mimimumValue.delay, delay));
        }

        if (this._origin.initOps === undefined && initOps !== undefined) {
            this._initOps = Math.max(Settings.mimimumValue.initOps, initOps);
        }

        if (this._origin.measurementCount === undefined && measurementCount !== undefined) {
            this._measurementCount = Math.max(Settings.mimimumValue.measurementCount, measurementCount);
        }

        if (this._origin.minMeasurementTime === undefined && minMeasurementTime !== undefined) {
            this._minMeasurementTime = Time.ms2ns(
                Math.max(Settings.mimimumValue.minMeasurementTime, minMeasurementTime),
            );
        }

        if (this._origin.warmupCount === undefined && warmupCount !== undefined) {
            this._warmupCount = Math.max(Settings.mimimumValue.warmupCount, warmupCount);
        }
    }
}
