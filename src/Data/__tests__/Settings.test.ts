import { BenchmarkingSettings } from '../../types';
import { Settings } from '../Settings';

describe(`Test class \`${Settings.name}\``, () => {
    it('news an instance with default settings', () => {
        const settings = new Settings({});

        expect(settings.delay).toBe(5_000_000);
        expect(settings.initOps).toBe(16);
        expect(settings.measurementCount).toBe(15);
        expect(settings.minMeasurementTime).toBe(250_000_000);
        expect(settings.warmupCount).toBe(7);
    });

    it('news an instance with custom settings', () => {
        const settings = new Settings({
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

    it('news an instance invalid custom settings', () => {
        const settings = new Settings({
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

    it(`calls method ${Settings.prototype.setButNoOverwriting.name}`, () => {
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

        const settings1 = new Settings({});
        const settings2 = new Settings(isettings1);
        const settings3 = new Settings(isettings1);

        settings1.setButNoOverwriting(isettings2);
        settings2.setButNoOverwriting({});
        settings3.setButNoOverwriting(isettings2);

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
