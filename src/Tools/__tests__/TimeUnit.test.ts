import { createClassJestHelper } from '../../__tests__/class';
import { TimeUnit, TimeUnitHelper } from '../TimeUnit';

const { buildStaticMethodName } = createClassJestHelper(TimeUnitHelper);

describe(`Test static method \`${buildStaticMethodName('getUnitStr')}\``, () => {
    it('should get time unit string', () => {
        expect(TimeUnitHelper.getUnitStr(TimeUnit.NS)).toMatchSnapshot();
        expect(TimeUnitHelper.getUnitStr(TimeUnit.US)).toMatchSnapshot();
        expect(TimeUnitHelper.getUnitStr(TimeUnit.MS)).toMatchSnapshot();
        expect(TimeUnitHelper.getUnitStr(TimeUnit.S)).toMatchSnapshot();
    });
});

describe(`Test static method \`${buildStaticMethodName('getUnitDescription')}\``, () => {
    it('should get time unit description', () => {
        expect(TimeUnitHelper.getUnitDescription(TimeUnit.NS)).toMatchSnapshot();
        expect(TimeUnitHelper.getUnitDescription(TimeUnit.US)).toMatchSnapshot();
        expect(TimeUnitHelper.getUnitDescription(TimeUnit.MS)).toMatchSnapshot();
        expect(TimeUnitHelper.getUnitDescription(TimeUnit.S)).toMatchSnapshot();
    });
});

describe(`Test static method \`${buildStaticMethodName('getFullDescription')}\``, () => {
    it('should get time unit full description', () => {
        expect(TimeUnitHelper.getFullDescription(TimeUnit.NS, 6)).toMatchSnapshot();
        expect(TimeUnitHelper.getFullDescription(TimeUnit.US, 6)).toMatchSnapshot();
        expect(TimeUnitHelper.getFullDescription(TimeUnit.MS, 6)).toMatchSnapshot();
        expect(TimeUnitHelper.getFullDescription(TimeUnit.S, 6)).toMatchSnapshot();
    });
});

describe(`Test static method \`${buildStaticMethodName('chooseUnit')}\``, () => {
    it('should choose a suitable time unit', () => {
        expect(TimeUnitHelper.chooseUnit(0)).toBe(TimeUnit.NS);
        expect(TimeUnitHelper.chooseUnit(1e3)).toBe(TimeUnit.NS);
        expect(TimeUnitHelper.chooseUnit(1e3 + 1)).toBe(TimeUnit.US);
        expect(TimeUnitHelper.chooseUnit(1e6)).toBe(TimeUnit.US);
        expect(TimeUnitHelper.chooseUnit(1e6 + 1)).toBe(TimeUnit.MS);
        expect(TimeUnitHelper.chooseUnit(1e9)).toBe(TimeUnit.MS);
        expect(TimeUnitHelper.chooseUnit(1e9 + 1)).toBe(TimeUnit.S);
    });
});
