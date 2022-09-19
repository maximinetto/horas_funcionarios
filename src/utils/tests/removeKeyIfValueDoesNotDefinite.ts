import removeKeyIfValueDoesNotDefined from "utils/removeKeyIfValueDoesNotDefined";

test("Should remove a key undefined", () => {
  const object = {
    a: "pepe",
    b: 1,
    c: null,
    d: undefined,
    e: () => {},
  };

  const result = removeKeyIfValueDoesNotDefined(object);
  expect(result).toEqual({ a: "pepe", b: 1, e: () => {} });
});
