export class ArrayUtil {
    static isReadonlyArray(arg: unknown): arg is readonly unknown[] {
        return Array.isArray(arg);
    }
}
