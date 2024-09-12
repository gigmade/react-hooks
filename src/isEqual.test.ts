import { isEqual } from './isEqual'

const obj = {
  someStr: 'prop',
  anArr: ['a', 'b', 'c'],
  aNum: 5,
  nested: { arr: [{ a: 9, b: 'x' }] },
}

const objSame = JSON.parse(JSON.stringify(obj))

const objDifferent = {
  ...obj,
  nested: { ...obj.nested, arr: [...obj.nested.arr, 'add'] },
}

describe('isEqual', () => {
  it('empty objects are equal', () => {
    expect(isEqual({}, {})).toBe(true)
  })

  it('same objects are equal', () => {
    expect(isEqual(obj, objSame)).toBe(true)
  })

  it('different objects are not equal', () => {
    expect(isEqual(obj, objDifferent)).toBe(false)
  })
})
