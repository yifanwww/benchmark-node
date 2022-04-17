import { Time } from '../Tools/TimeTool';
import { BenchmarkingSettings, Millisecond, Nanosecond } from '../types';

interface ISettings {
    delay: Nanosecond;
    initOps: number;
    measurementCount: number;
    minMeasurementTime: Nanosecond;
    warmupCount: number;
}

export class Settings {
    public static readonly DefaultValue: Settings = new Settings({
        delay: Time.ms2ns(5),
        initOps: 16,
        measurementCount: 15,
        minMeasurementTime: Time.ms2ns(250),
        warmupCount: 7,
    });

    public static readonly MimimumValue: Settings = new Settings({
        delay: Time.ms2ns(1),
        initOps: 1,
        measurementCount: 3,
        minMeasurementTime: Time.ms2ns(1),
        warmupCount: 1,
    });

    private declare _delay: Nanosecond;
    private declare _initOps: number;
    private declare _measurementCount: number;
    private declare _minMeasurementTime: Nanosecond;
    private declare _warmupCount: number;

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

    private constructor(settings: ISettings) {
        const { delay, initOps, measurementCount, minMeasurementTime, warmupCount } = settings;

        this._delay = delay;
        this._initOps = initOps;
        this._measurementCount = measurementCount;
        this._minMeasurementTime = minMeasurementTime;
        this._warmupCount = warmupCount;
    }

    private static normalizeDelay(num: Millisecond | undefined, d: Nanosecond): Nanosecond {
        return num ? Math.max(Settings.MimimumValue.delay, Time.ms2ns(Math.floor(num))) : d;
    }

    private static normalizeInitOps(num: number | undefined, d: number): number {
        return num ? Math.max(Settings.MimimumValue.initOps, Math.floor(num)) : d;
    }

    private static normalizeMeasurementCount(num: number | undefined, d: number): number {
        return num ? Math.max(Settings.MimimumValue.measurementCount, Math.floor(num)) : d;
    }

    private static normalizeMinMeasurementTime(num: Millisecond | undefined, d: Nanosecond): Nanosecond {
        return num ? Math.max(Settings.MimimumValue.minMeasurementTime, Time.ms2ns(Math.floor(num))) : d;
    }

    private static normalizeWarmupCount(num: number | undefined, d: number): number {
        return num ? Math.max(Settings.MimimumValue.warmupCount, Math.floor(num)) : d;
    }

    public static from(settings: Readonly<BenchmarkingSettings>): Settings {
        const { delay, initOps, measurementCount, minMeasurementTime, warmupCount } = settings;

        const _default = Settings.DefaultValue;

        return new Settings({
            delay: Settings.normalizeDelay(delay, _default.delay),
            initOps: Settings.normalizeInitOps(initOps, _default.initOps),
            measurementCount: Settings.normalizeMeasurementCount(measurementCount, _default.measurementCount),
            minMeasurementTime: Settings.normalizeMinMeasurementTime(minMeasurementTime, _default.minMeasurementTime),
            warmupCount: Settings.normalizeWarmupCount(warmupCount, _default.warmupCount),
        });
    }

    public merge(settings: Readonly<BenchmarkingSettings>): Settings {
        const { delay, initOps, measurementCount, minMeasurementTime, warmupCount } = settings;

        return new Settings({
            delay: Settings.normalizeDelay(delay, this._delay),
            initOps: Settings.normalizeInitOps(initOps, this._initOps),
            measurementCount: Settings.normalizeMeasurementCount(measurementCount, this._measurementCount),
            minMeasurementTime: Settings.normalizeMinMeasurementTime(minMeasurementTime, this._minMeasurementTime),
            warmupCount: Settings.normalizeWarmupCount(warmupCount, this._warmupCount),
        });
    }
}
