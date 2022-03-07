export default function removeKeyIfValueDoesNotDefined(obj) {
  Object.entries(obj).forEach(([key, value]) => {
    if (!value) {
      delete obj[key];
    }
  });
}
