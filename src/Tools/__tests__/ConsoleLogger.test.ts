import { mockConsoleLogger } from '../../__tests__/ConsoleLoggerTestTool';
import { ConsoleLogger } from '../ConsoleLogger';

describe(`Test class \`${ConsoleLogger.name}\``, () => {
    beforeEach(() => mockConsoleLogger());

    it(`calls method ${ConsoleLogger.prototype.write.name}`, () => {
        expect(ConsoleLogger.default.write('Hello world'));
    });

    it(`calls method ${ConsoleLogger.prototype.writeHeader.name}`, () => {
        expect(ConsoleLogger.default.writeHeader('Hello world'));
    });

    it(`calls method ${ConsoleLogger.prototype.writeStatistic.name}`, () => {
        expect(ConsoleLogger.default.writeStatistic('Hello world'));
    });

    it(`calls method ${ConsoleLogger.prototype.writeInfo.name}`, () => {
        expect(ConsoleLogger.default.writeInfo('Hello world'));
    });

    it(`calls method ${ConsoleLogger.prototype.writeError.name}`, () => {
        expect(ConsoleLogger.default.writeError('Hello world'));
    });

    it(`calls method ${ConsoleLogger.prototype.writeLine.name}`, () => {
        expect(ConsoleLogger.default.writeLine());
        expect(ConsoleLogger.default.writeLine('Hello world'));
    });

    it(`calls method ${ConsoleLogger.prototype.writeLineHeader.name}`, () => {
        expect(ConsoleLogger.default.writeLineHeader('Hello world'));
    });

    it(`calls method ${ConsoleLogger.prototype.writeLineStatistic.name}`, () => {
        expect(ConsoleLogger.default.writeLineStatistic('Hello world'));
    });

    it(`calls method ${ConsoleLogger.prototype.writeLineInfo.name}`, () => {
        expect(ConsoleLogger.default.writeLineInfo('Hello world'));
    });

    it(`calls method ${ConsoleLogger.prototype.writeLineError.name}`, () => {
        expect(ConsoleLogger.default.writeLineError('Hello world'));
    });
});
