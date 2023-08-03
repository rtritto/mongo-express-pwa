// https://github.com/vercel/next.js/discussions/15054#discussioncomment-658138
class GlobalRef<T> {
  private readonly sym: symbol

  constructor(uniqueName: string) {
    this.sym = Symbol.for(uniqueName)
  }

  get value() {
    return (global as any)[this.sym] as T | undefined
  }

  set value(value: T | undefined) {
    (global as any)[this.sym] = value
  }
}

export const getGlobalValue = <T>(uniqueName: string): T | undefined => {
  const globalInstance = new GlobalRef<T>(uniqueName)
  return globalInstance.value
}

export const getGlobalValueAndReset = <T>(uniqueName: string): T | undefined => {
  const globalInstance = new GlobalRef<T>(uniqueName)
  const { value } = globalInstance
  globalInstance.value = undefined
  return value
}

export const setGlobalValue = <T>(uniqueName: string, valueToSet: T): GlobalRef<T> => {
  const globalInstance = new GlobalRef<T>(uniqueName)
  globalInstance.value = valueToSet
  return globalInstance
}