const destructObjArrayWithId = (object?: { id: number }[]) => {
  return (object || []).map((x) => x.id)
}

const removeProperty = (object: any, propertyName: string) => {
  let { [propertyName]: _, ...rest } = object
  return rest
}

export default {
  destructObjArrayWithId,
  removeProperty,
}
