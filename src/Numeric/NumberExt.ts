export class NumberExt {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly POSITIVE_INFINITY = 1.0 / 0.0;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly NEGATIVE_INFINITY = -1.0 / 0.0;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly EPSILON = 4.94065645841247e-324;

    public static isInfinity = (n: number) => !Number.isFinite(n);

    public static uint8ToUint32 = (n1: number, n2: number, n3: number, n4: number) =>
        n1 + (n2 << 8) + (n3 << 16) + (n4 << 23) * 2;
}
