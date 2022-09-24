import { generateRandomUUIDV4 } from "../../utils/strings";

test("Should generate a valid string uuidv4", () => {
  const string = generateRandomUUIDV4();
  const validV4 = new RegExp(
    /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  );
  expect(string).toMatch(validV4);
});
