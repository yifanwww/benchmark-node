import { Time } from '../Tools/TimeTool';
import type { BenchmarkingSettings, Millisecond, Nanosecond } from '../types';

interface ISettings {
    delay: Nanosecond;
    initOps: number;
    measurementCount: number;
    minMeasurementTime: Nanosecond;
    warmupCount: number;
}

export class Settings {
    static readonly DefaultValue: Settings = new Settings({
        delay: Time.ms2ns(5),
        initOps: 16,
        measurementCount: 15,
        minMeasurementTime: Time.ms2ns(250),
        warmupCount: 7,
    });

    static readonly MimimumValue: Settings = new Settings({
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

    get delay(): Nanosecond {
        return this._delay;
    }

    get initOps(): number {
        return this._initOps;
    }

    get measurementCount(): number {
        return this._measurementCount;
    }

    get minMeasurementTime(): Nanosecond {
        return this._minMeasurementTime;
    }

    get warmupCount(): number {
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

    private static _normalizeDelay(num: Millisecond | undefined, d: Nanosecond): Nanosecond {
        return num ? Math.max(Settings.MimimumValue.delay, Time.ms2ns(Math.floor(num))) : d;
    }

    private static _normalizeInitOps(num: number | undefined, d: number): number {
        return num ? Math.max(Settings.MimimumValue.initOps, Math.floor(num)) : d;
    }

    private static _normalizeMeasurementCount(num: number | undefined, d: number): number {
        return num ? Math.max(Settings.MimimumValue.measurementCount, Math.floor(num)) : d;
    }

    private static _normalizeMinMeasurementTime(num: Millisecond | undefined, d: Nanosecond): Nanosecond {
        return num ? Math.max(Settings.MimimumValue.minMeasurementTime, Time.ms2ns(Math.floor(num))) : d;
    }

    private static _normalizeWarmupCount(num: number | undefined, d: number): number {
        return num ? Math.max(Settings.MimimumValue.warmupCount, Math.floor(num)) : d;
    }

    static from(settings: Readonly<BenchmarkingSettings>): Settings {
        const { delay, initOps, measurementCount, minMeasurementTime, warmupCount } = settings;

        const _default = Settings.DefaultValue;

        return new Settings({
            delay: Settings._normalizeDelay(delay, _default.delay),
            initOps: Settings._normalizeInitOps(initOps, _default.initOps),
            measurementCount: Settings._normalizeMeasurementCount(measurementCount, _default.measurementCount),
            minMeasurementTime: Settings._normalizeMinMeasurementTime(minMeasurementTime, _default.minMeasurementTime),
            warmupCount: Settings._normalizeWarmupCount(warmupCount, _default.warmupCount),
        });
    }

    merge(settings: Readonly<BenchmarkingSettings>): Settings {
        const { delay, initOps, measurementCount, minMeasurementTime, warmupCount } = settings;

        return new Settings({
            delay: Settings._normalizeDelay(delay, this._delay),
            initOps: Settings._normalizeInitOps(initOps, this._initOps),
            measurementCount: Settings._normalizeMeasurementCount(measurementCount, this._measurementCount),
            minMeasurementTime: Settings._normalizeMinMeasurementTime(minMeasurementTime, this._minMeasurementTime),
            warmupCount: Settings._normalizeWarmupCount(warmupCount, this._warmupCount),
        });
    }
}
