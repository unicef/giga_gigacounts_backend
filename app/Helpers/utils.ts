const destructObjArrayWithId = (object?: { id: string }[]) => {
  return (object || []).map((x) => x.id)
}

const removeProperty = (object: any, propertyName: string) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  let { [propertyName]: _, ...rest } = object
  return rest
}

const getPercentage = (baseValue: number, value: number) => (value / baseValue) * 100

const splitIntoChunks = (array: any[], chunkSize: number) => {
  if (chunkSize === 0) return array
  if (array.length === 0) return []
  const otherChunks = splitIntoChunks(array.slice(chunkSize), chunkSize)
  return [array.slice(0, chunkSize), ...otherChunks]
}

export default {
  destructObjArrayWithId,
  removeProperty,
  getPercentage,
  splitIntoChunks,
}
