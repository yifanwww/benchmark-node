import { TimeUnit, TimeUnitHelper } from '../TimeUnit';

describe(`Test class \`${TimeUnitHelper.name}\``, () => {
    it(`calls static method ${TimeUnitHelper.getUnitStr.name}`, () => {
        expect(TimeUnitHelper.getUnitStr(TimeUnit.NS)).toMatchSnapshot();
        expect(TimeUnitHelper.getUnitStr(TimeUnit.US)).toMatchSnapshot();
        expect(TimeUnitHelper.getUnitStr(TimeUnit.MS)).toMatchSnapshot();
        expect(TimeUnitHelper.getUnitStr(TimeUnit.S)).toMatchSnapshot();
    });

    it(`calls static method ${TimeUnitHelper.getUnitDescription.name}`, () => {
        expect(TimeUnitHelper.getUnitDescription(TimeUnit.NS)).toMatchSnapshot();
        expect(TimeUnitHelper.getUnitDescription(TimeUnit.US)).toMatchSnapshot();
        expect(TimeUnitHelper.getUnitDescription(TimeUnit.MS)).toMatchSnapshot();
        expect(TimeUnitHelper.getUnitDescription(TimeUnit.S)).toMatchSnapshot();
    });

    it(`calls static method ${TimeUnitHelper.getFullDescription.name}`, () => {
        expect(TimeUnitHelper.getFullDescription(TimeUnit.NS, 6)).toMatchSnapshot();
        expect(TimeUnitHelper.getFullDescription(TimeUnit.US, 6)).toMatchSnapshot();
        expect(TimeUnitHelper.getFullDescription(TimeUnit.MS, 6)).toMatchSnapshot();
        expect(TimeUnitHelper.getFullDescription(TimeUnit.S, 6)).toMatchSnapshot();
    });

    it(`calls static method ${TimeUnitHelper.chooseUnit.name}`, () => {
        expect(TimeUnitHelper.chooseUnit(0)).toBe(TimeUnit.NS);
        expect(TimeUnitHelper.chooseUnit(1e3)).toBe(TimeUnit.NS);
        expect(TimeUnitHelper.chooseUnit(1e3 + 1)).toBe(TimeUnit.US);
        expect(TimeUnitHelper.chooseUnit(1e6)).toBe(TimeUnit.US);
        expect(TimeUnitHelper.chooseUnit(1e6 + 1)).toBe(TimeUnit.MS);
        expect(TimeUnitHelper.chooseUnit(1e9)).toBe(TimeUnit.MS);
        expect(TimeUnitHelper.chooseUnit(1e9 + 1)).toBe(TimeUnit.S);
    });
});
