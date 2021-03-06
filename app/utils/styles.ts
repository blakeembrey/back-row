/**
 * Create a grid container with a certain size between each element.
 */
export function grid (size: number | string) {
  return {
    marginLeft: `-${size}`,
    marginRight: `-${size}`,

    '> *': {
      marginLeft: size,
      marginRight: size
    }
  }
}
