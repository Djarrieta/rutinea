/** Capitalize first letter of each word */
export function properCase(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}
