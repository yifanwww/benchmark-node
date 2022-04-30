export function mockConsoleLogger() {
    jest.spyOn(process.stdout, 'write').mockImplementation((str) => {
        expect(str).toMatchSnapshot();
        return true;
    });
}
