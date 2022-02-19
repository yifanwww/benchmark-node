export class Environment {
    public static get nodeVersion() {
        return process.version;
    }

    public static get v8Version() {
        return process.versions.v8;
    }
}
