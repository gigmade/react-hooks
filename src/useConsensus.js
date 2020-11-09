import { useState, useEffect, useMemo, useCallback } from 'react'

export default (sharedIds = false) => {
  // Wrap in { set } to make the set addition and deletion behave like immutable.
  const [disagreementIds, setLockedIds] = useState({ set: null })

  // `sharedIds` is a static parameter and shouldn't change during consensus
  // negotiation. If it does, we reset the consensus first.
  useEffect(() => {
    setLockedIds({ set: new Set() })
  }, [sharedIds])

  const disagreement = useMemo(() => {
    return disagreementIds && disagreementIds.size > 0
  }, [disagreementIds])

  const disagree = useCallback(
    (id) => {
      // Just make all clientIds unique unless sharedIds = true
      // We still add an optional 'reason' for debugging.
      const uniqueId = sharedIds ? id : { reason: id }

      setLockedIds((set) => {
        set.add(uniqueId)
        return { set }
      })

      return () =>
        setLockedIds((set) => {
          set.delete(uniqueId)
          return { set }
        })
    },
    [sharedIds]
  )

  // Explanation:
  // - disagree: break consensus - returns function for ending break.
  // - disagreement: true if no consensus
  return [disagree, disagreement]
}
