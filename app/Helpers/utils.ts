const destructObjArrayWithId = (object?: { id: number }[]) => {
  return (object || []).map((x) => x.id)
}

const removeProperty = (object: any, propertyName: string) => {
  let { [propertyName]: _, ...rest } = object
  return rest
}

const getPercentage = (baseValue: number, value: number) => (value / baseValue) * 100

export default {
  destructObjArrayWithId,
  removeProperty,
  getPercentage,
}
