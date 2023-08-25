export function objectStorageFactory() {
  let memoryStorage: Record<string, string> = {}

  function clear(): void {
    memoryStorage = {}
  }

  function getItem(keyId: string): string | null {
    return memoryStorage.hasOwnProperty(keyId) ? memoryStorage[keyId] : null
  }

  function key(index: number): string | null {
    return Object.keys(memoryStorage)[index] || null
  }

  function removeItem(keyId: string) {
    delete memoryStorage[keyId]
  }

  function setItem(keyId: string, value: string) {
    memoryStorage[keyId] = value
  }

  function length(): number {
    return Object.keys(memoryStorage).length
  }

  return {
    key,
    clear,
    getItem,
    setItem,
    removeItem,
    get length() {
      return length()
    }
  }
}
