import { ConsoleLogger } from '../ConsoleLogger';

describe(`Test class \`${ConsoleLogger.name}\``, () => {
    beforeEach(() => {
        jest.spyOn(process.stdout, 'write').mockImplementation((str) => {
            expect(str).toMatchSnapshot();
            return true;
        });
    });

    it(`calls method ${ConsoleLogger.prototype.write.name}`, () => {
        expect(ConsoleLogger.default.write('Hello world'));
    });

    it('calls method writeHeader', () => {
        expect(ConsoleLogger.default.writeHeader('Hello world'));
    });

    it('calls method writeStatistic', () => {
        expect(ConsoleLogger.default.writeStatistic('Hello world'));
    });

    it('calls method writeInfo', () => {
        expect(ConsoleLogger.default.writeInfo('Hello world'));
    });

    it('calls method writeError', () => {
        expect(ConsoleLogger.default.writeError('Hello world'));
    });

    it(`calls method ${ConsoleLogger.prototype.writeLine.name}`, () => {
        expect(ConsoleLogger.default.writeLine());
        expect(ConsoleLogger.default.writeLine('Hello world'));
    });

    it('calls method writeLineHeader', () => {
        expect(ConsoleLogger.default.writeLineHeader('Hello world'));
    });

    it('calls method writeLineStatistic', () => {
        expect(ConsoleLogger.default.writeLineStatistic('Hello world'));
    });

    it('calls method writeLineInfo', () => {
        expect(ConsoleLogger.default.writeLineInfo('Hello world'));
    });

    it('calls method writeLineError', () => {
        expect(ConsoleLogger.default.writeLineError('Hello world'));
    });
});
