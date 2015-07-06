import extend = require('xtend')

export function otherwise <T> (value: T, otherwise: T): T {
  return value == null ? otherwise : value
}

export function diff (oldObject: any = {}, newObject: any = {}): any {
  const diff: any = {}

  Object.keys(newObject).forEach(function (key) {
    if (newObject[key] !== oldObject[key]) {
      diff[key] = newObject[key]
    }
  })

  return diff
}
