export type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>;
};

export type NonNullable<T> = Exclude<T, null | undefined>;

export type Property = "body" | "params" | "query" | "headers" | "cookies";
