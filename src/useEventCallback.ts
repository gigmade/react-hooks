import { useCallback, useRef } from 'react'
import { useLayoutEffect } from 'react-layout-effect'

type Fn<ARGS extends any[], R> = (...args: ARGS) => R

function useEventCallback<A extends any[], R>(fn: Fn<A, R>): Fn<A, R> {
  const ref = useRef<Fn<A, R>>(fn)

  useLayoutEffect(() => {
    ref.current = fn
  })

  return useCallback((...args: A): R => {
    const { current } = ref
    return current(...args)
  }, [])
}

export default useEventCallback
