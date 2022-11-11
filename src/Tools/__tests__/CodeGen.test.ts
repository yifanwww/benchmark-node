import { CodeGen } from '../CodeGen';

describe(`Test method \`${CodeGen.name}\``, () => {
    it('create tester with 0 argument', () => {
        const tester = CodeGen.createTester({ argument: { count: 0 } });
        expect(tester.toString()).toMatchSnapshot();
    });

    it('create tester with 1 argument', () => {
        const tester = CodeGen.createTester({ argument: { count: 1 } });
        expect(tester.toString()).toMatchSnapshot();
    });

    it('create tester with 2 arguments', () => {
        const tester = CodeGen.createTester({ argument: { count: 2 } });
        expect(tester.toString()).toMatchSnapshot();
    });

    it('create tester with 3 arguments', () => {
        const tester = CodeGen.createTester({ argument: { count: 3 } });
        expect(tester.toString()).toMatchSnapshot();
    });

    it('create tester with 4 arguments', () => {
        const tester = CodeGen.createTester({ argument: { count: 4 } });
        expect(tester.toString()).toMatchSnapshot();
    });

    it('create tester with rest arguments', () => {
        const tester = CodeGen.createTester({ argument: { count: 0, rest: true } });
        expect(tester.toString()).toMatchSnapshot();
    });

    it('create tester with normal arguments and rest arguments', () => {
        const tester = CodeGen.createTester({ argument: { count: 5, rest: true } });
        expect(tester.toString()).toMatchSnapshot();
    });
});
