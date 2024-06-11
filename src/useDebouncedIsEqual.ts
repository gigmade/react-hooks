import { useState, useEffect } from 'react'
import { isEqual } from './isEqual'
import { useDebouncedCallback } from 'use-debounce'

export default function useDebouncedIsEqual(
  item1: any,
  item2: any,
  delay: number,
): boolean {
  const [identical, setIdentical] = useState(false)

  const debouncedIdenticalCheck = useDebouncedCallback(() => {
    setIdentical(!isEqual(item1, item2))
  }, delay)

  useEffect(() => {
    debouncedIdenticalCheck()
  }, [debouncedIdenticalCheck, item1, item2])

  return identical
}
