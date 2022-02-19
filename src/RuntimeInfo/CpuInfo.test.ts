import { CpuInfo } from './CpuInfo';

describe(`Test class ${CpuInfo.name}`, () => {
    it('get data from system', () => {
        expect(() => new CpuInfo()).not.toThrow();

        const cpuInfo = new CpuInfo();
        expect(typeof cpuInfo.name).toBe('string');
        expect(cpuInfo.processors).not.toBeNaN();
        expect(cpuInfo.logicalCores).not.toBeNaN();
        expect(cpuInfo.plysicalCores).not.toBeNaN();
    });

    it('to string', () => {
        function testToString(obj: unknown) {
            expect(CpuInfo.prototype.toString.call(obj)).toMatchSnapshot();
        }

        testToString({ name: '<cpu-name>', processors: 0, logicalCores: 0, plysicalCores: 0 });
        testToString({ name: '<cpu-name>', processors: 0, logicalCores: 0, plysicalCores: 1 });
        testToString({ name: '<cpu-name>', processors: 0, logicalCores: 0, plysicalCores: 2 });
        testToString({ name: '<cpu-name>', processors: 0, logicalCores: 1, plysicalCores: 0 });
        testToString({ name: '<cpu-name>', processors: 0, logicalCores: 1, plysicalCores: 1 });
        testToString({ name: '<cpu-name>', processors: 0, logicalCores: 1, plysicalCores: 2 });
        testToString({ name: '<cpu-name>', processors: 0, logicalCores: 2, plysicalCores: 0 });
        testToString({ name: '<cpu-name>', processors: 0, logicalCores: 2, plysicalCores: 1 });
        testToString({ name: '<cpu-name>', processors: 0, logicalCores: 2, plysicalCores: 2 });
        testToString({ name: '<cpu-name>', processors: 1, logicalCores: 0, plysicalCores: 0 });
        testToString({ name: '<cpu-name>', processors: 1, logicalCores: 0, plysicalCores: 1 });
        testToString({ name: '<cpu-name>', processors: 1, logicalCores: 0, plysicalCores: 2 });
        testToString({ name: '<cpu-name>', processors: 1, logicalCores: 1, plysicalCores: 0 });
        testToString({ name: '<cpu-name>', processors: 1, logicalCores: 1, plysicalCores: 1 });
        testToString({ name: '<cpu-name>', processors: 1, logicalCores: 1, plysicalCores: 2 });
        testToString({ name: '<cpu-name>', processors: 1, logicalCores: 2, plysicalCores: 0 });
        testToString({ name: '<cpu-name>', processors: 1, logicalCores: 2, plysicalCores: 1 });
        testToString({ name: '<cpu-name>', processors: 1, logicalCores: 2, plysicalCores: 2 });
        testToString({ name: '<cpu-name>', processors: 2, logicalCores: 0, plysicalCores: 0 });
        testToString({ name: '<cpu-name>', processors: 2, logicalCores: 0, plysicalCores: 1 });
        testToString({ name: '<cpu-name>', processors: 2, logicalCores: 0, plysicalCores: 2 });
        testToString({ name: '<cpu-name>', processors: 2, logicalCores: 1, plysicalCores: 0 });
        testToString({ name: '<cpu-name>', processors: 2, logicalCores: 1, plysicalCores: 1 });
        testToString({ name: '<cpu-name>', processors: 2, logicalCores: 1, plysicalCores: 2 });
        testToString({ name: '<cpu-name>', processors: 2, logicalCores: 2, plysicalCores: 0 });
        testToString({ name: '<cpu-name>', processors: 2, logicalCores: 2, plysicalCores: 1 });
        testToString({ name: '<cpu-name>', processors: 2, logicalCores: 2, plysicalCores: 2 });
    });
});
