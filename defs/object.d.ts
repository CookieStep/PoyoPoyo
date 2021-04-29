interface ObjectConstructor {
    entries(object: object): [string | Symbol, any][];
}