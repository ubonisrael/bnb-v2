export function flattenObject(
    source: Record<string, any>,
    target: Record<string, any> = {}
  ): Record<string, any> {
    for (const [key, value] of Object.entries(source)) {
      if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        flattenObject(value, target); // recurse into nested object
      } else {
        target[key] = value;
      }
    }
    return target;
  }
  