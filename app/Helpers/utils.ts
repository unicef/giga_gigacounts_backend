const destructObjArrayWithId = (object?: { id: number }[]) => {
  return (object || []).map((x) => x.id)
}

const removeProperty = (object: any, propertyName: string) => {
  let { [propertyName]: _, ...rest } = object
  return rest
}

const getPercentage = (baseValue: number, value: number) => (value / baseValue) * 100

const join = (arr: string[], separator: string) =>
  arr.reduce((str, a) => {
    if (a && !str) return a
    if (a) return str + separator + a
    return str
  })

export default {
  destructObjArrayWithId,
  removeProperty,
  getPercentage,
  join,
}
