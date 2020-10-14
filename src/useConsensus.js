import { useState, useEffect, useMemo, useCallback } from 'react'

export default (sharedIds = false) => {
  const [disagreementIds, setLockedIds] = useState(null)

  // `sharedIds` is a static parameter and shouldn't change during consensus
  // negotiation. If it does, we reset the consensus first.
  useEffect(() => {
    setLockedIds(new Set())
  }, [sharedIds])

  const disagreement = useMemo(() => {
    return disagreementIds && disagreementIds.size > 0
  }, [disagreementIds])

  const disagree = useCallback(
    (id) => {
      // Just make all clientIds unique unless sharedIds = true
      // We still add an optional 'reason' for debugging.
      const uniqueId = sharedIds ? id : { reason: id }

      setLockedIds((set) => set.add(uniqueId))

      return () => setLockedIds((set) => set.delete(uniqueId))
    },
    [sharedIds]
  )

  // Explanation:
  // - disagree: break consensus - returns function for ending break.
  // - disagreement: true if no consensus
  return [disagree, disagreement]
}
