export function removeZerosFromNumber(value: string | number): number {
  const str = value.toString();
  if (str.includes(".")) {
    return parseFloat(str);
  }

  const shortened = Math.floor(Number(str) / 1000);
  return shortened;
}
