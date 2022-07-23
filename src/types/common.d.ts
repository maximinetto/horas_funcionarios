export type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>;
};

type Complete<T> = {
  [P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>>
    ? T[P]
    : T[P] | undefined;
};

export type NonNullable<T> = Exclude<T, null | undefined>;

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type Property = "body" | "params" | "query" | "headers" | "cookies";
