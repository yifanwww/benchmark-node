import { Settings } from '../Settings';

describe(`Test class \`${Settings.name}\``, () => {
    it('returns default settings', () => {
        const settings = new Settings({});

        expect(settings.delay).toBe(5_000_000);
        expect(settings.initOps).toBe(16);
        expect(settings.measurementCount).toBe(15);
        expect(settings.minMeasurementTime).toBe(250_000_000);
        expect(settings.warmupCount).toBe(7);
    });

    it('gets custom settings', () => {
        const settings = new Settings({
            delay: 1,
            initOps: 100,
            measurementCount: 10,
            minMeasurementTime: 25,
            warmupCount: 8,
        });

        expect(settings.delay).toBe(1_000_000);
        expect(settings.initOps).toBe(100);
        expect(settings.measurementCount).toBe(10);
        expect(settings.minMeasurementTime).toBe(25_000_000);
        expect(settings.warmupCount).toBe(8);
    });
});
