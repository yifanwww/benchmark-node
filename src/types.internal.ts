// eslint-disable-next-line @typescript-eslint/naming-convention
export type _Millisecond = number & { __ms__: void };

// eslint-disable-next-line @typescript-eslint/naming-convention
export type _Nanosecond = number & { __ns__: void };

// eslint-disable-next-line @typescript-eslint/naming-convention
export type _Argument = unknown & { __arg__: void };
export type _Arguments = _Argument[];

export type Hrtime = [number, number];

export type ConfidenceInterval = [_Nanosecond, _Nanosecond];
