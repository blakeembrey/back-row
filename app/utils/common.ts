export function otherwise <T> (value: T, otherwise: T): T {
  return value == null ? otherwise : value
}
