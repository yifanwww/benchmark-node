import type { BenchmarkingSettings } from '../../types';
import { Settings } from '../Settings';

describe(`Test class \`${Settings.name}\``, () => {
    it('creates an instance with default settings', () => {
        const settings = Settings.from({});

        expect(settings.delay).toBe(Settings.DefaultValue.delay);
        expect(settings.initOps).toBe(Settings.DefaultValue.initOps);
        expect(settings.measurementCount).toBe(Settings.DefaultValue.measurementCount);
        expect(settings.minMeasurementTime).toBe(Settings.DefaultValue.minMeasurementTime);
        expect(settings.warmupCount).toBe(Settings.DefaultValue.warmupCount);
    });

    it('creates an instance with custom settings', () => {
        const settings = Settings.from({
            delay: 2,
            initOps: 100,
            measurementCount: 10,
            minMeasurementTime: 25,
            warmupCount: 8,
        });

        expect(settings.delay).toBe(2_000_000);
        expect(settings.initOps).toBe(100);
        expect(settings.measurementCount).toBe(10);
        expect(settings.minMeasurementTime).toBe(25_000_000);
        expect(settings.warmupCount).toBe(8);
    });

    it('creates an instance invalid custom settings', () => {
        const settings = Settings.from({
            delay: -1,
            initOps: -1,
            measurementCount: -1,
            minMeasurementTime: -1,
            warmupCount: -1,
        });

        expect(settings.delay).toBe(1_000_000);
        expect(settings.initOps).toBe(1);
        expect(settings.measurementCount).toBe(3);
        expect(settings.minMeasurementTime).toBe(1_000_000);
        expect(settings.warmupCount).toBe(1);
    });

    it(`calls method ${Settings.prototype.merge.name}`, () => {
        const isettings1: BenchmarkingSettings = {
            delay: 2,
            initOps: 100,
            measurementCount: 10,
            minMeasurementTime: 25,
            warmupCount: 8,
        };
        const isettings2: BenchmarkingSettings = {
            delay: 20,
            initOps: 200,
            measurementCount: 20,
            minMeasurementTime: 750,
            warmupCount: 15,
        };

        const settings1 = Settings.from({}).merge(isettings2);
        const settings2 = Settings.from(isettings1).merge({});
        const settings3 = Settings.from(isettings2).merge(isettings1);

        expect(settings1.delay).toBe(20_000_000);
        expect(settings1.initOps).toBe(200);
        expect(settings1.measurementCount).toBe(20);
        expect(settings1.minMeasurementTime).toBe(750_000_000);
        expect(settings1.warmupCount).toBe(15);

        expect(settings2.delay).toBe(2_000_000);
        expect(settings2.initOps).toBe(100);
        expect(settings2.measurementCount).toBe(10);
        expect(settings2.minMeasurementTime).toBe(25_000_000);
        expect(settings2.warmupCount).toBe(8);

        expect(settings3.delay).toBe(2_000_000);
        expect(settings3.initOps).toBe(100);
        expect(settings3.measurementCount).toBe(10);
        expect(settings3.minMeasurementTime).toBe(25_000_000);
        expect(settings3.warmupCount).toBe(8);
    });
});
