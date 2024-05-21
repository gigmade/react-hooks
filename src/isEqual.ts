export type JsonableObj = { [key: string]: Jsonable }
export type JsonableArr = Jsonable[]
export type Jsonable =
  | JsonableArr
  | JsonableObj
  | string
  | number
  | boolean
  | null

export type TJsonPathValue = {
  path: string
  value: Jsonable
  marker?: 'v' | '^'
}

export const NUMBER = 'number'
export const BOOLEAN = 'boolean'
export const NULL = 'null'
export const STRING = 'string'
export const PRIMITIVES = [NUMBER, BOOLEAN, NULL, STRING]
export const ARRAY = 'array'
export const OBJECT = 'object'
export const STRUCTURES = [ARRAY, OBJECT]

function getType(
  obj?: Jsonable
): (typeof PRIMITIVES)[number] | (typeof STRUCTURES)[number] | undefined {
  const type = typeof obj

  if (type === BOOLEAN || type === STRING || type === 'undefined') {
    return type
  } else if (type === NUMBER && isFinite(obj as number)) {
    return NUMBER
  } else if (type === OBJECT) {
    if (Array.isArray(obj)) {
      return ARRAY
    } else if (obj === null) {
      return NULL
    }
    return OBJECT
  }

  throw new Error(`getType: Invalid type ${type}`)
}

export function isEqual(obj1: Jsonable, obj2: Jsonable) {
  const obj1Type = getType(obj1)
  const obj2Type = getType(obj2)

  if (obj1Type !== obj2Type) return false

  switch (obj1Type) {
    case NUMBER: {
      if (obj1 === 0 && 1 / obj1 === -Infinity)
        return obj2 === 0 && 1 / obj2 === -Infinity

      return obj1 === obj2
    }
    case STRING:
    case NULL:
    case BOOLEAN: {
      return obj1 === obj2
    }
  }

  if (obj1Type === ARRAY) {
    obj1 = obj1 as JsonableArr
    obj2 = obj2 as JsonableArr
    if (obj1.length !== obj2.length) {
      return false
    }

    for (let i = 0, l = obj1.length; i < l; i++)
      if (!isEqual(obj1[i], obj2[i])) {
        return false
      }

    return true
  }

  if (obj1Type === OBJECT) {
    obj1 = obj1 as JsonableObj
    obj2 = obj2 as JsonableObj

    const keys = Object.keys(obj1)

    if (keys.length !== Object.keys(obj2).length) {
      return false
    }

    for (let i = 0, l = keys.length; i < l; i++) {
      const key = keys[i]

      if (obj2.hasOwnProperty && !obj2.hasOwnProperty(key)) {
        return false
      }

      if (!isEqual(obj2[key], obj1[key])) {
        return false
      }
    }

    return true
  }

  return true
}
