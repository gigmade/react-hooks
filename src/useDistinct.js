import { useState } from 'react'
import useDeepCompareEffect from 'react-use/lib/useDeepCompareEffect'

export default function useDistinct(value, comparator) {
  const [uniqueValue, setUniqueValue] = useState(value)

  useDeepCompareEffect(() => {
    setUniqueValue(value)
  }, [value])

  return uniqueValue
}
