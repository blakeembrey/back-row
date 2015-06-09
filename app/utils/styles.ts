/**
 * Create a grid container with a certain size between each element.
 */
export function grid (size: number | string) {
  return {
    marginLeft: `-${size}`,
    marginRight: `-${size}`,

    '> *': {
      paddingLeft: size,
      paddingRight: size
    }
  }
}
