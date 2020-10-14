import { useCallback, useRef, useLayoutEffect } from 'react'

function useEventCallback(fn, dependencies) {
  const ref = useRef(() => {
    throw new Error('Cannot call an eventCallback handler while rendering.')
  })

  useLayoutEffect(() => {
    ref.current = fn
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fn, ...dependencies])

  return useCallback(
    (...args) => {
      const fn = ref.current
      return fn(...args)
    },
    [ref]
  )
}

export default useEventCallback
