interface ArrayConstructor {
    isArray(arg: unknown): arg is unknown[] | readonly unknown[];
}
