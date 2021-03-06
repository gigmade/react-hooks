import { useState, useEffect, useMemo, useCallback } from 'react'

/*
 * Poor man's immutable set implementation.
 */
function ISet() {
  const set = new Set()

  function add(item) {
    set.add(item)
    return newSet()
  }

  function del(item) {
    set.delete(item)
    return newSet()
  }

  function newSet() {
    return { add, delete: del, size: set.size }
  }

  return newSet()
}

export default (sharedIds = false) => {
  // Wrap in { set } to make the set addition and deletion behave like immutable.
  const [disagreementIds, setLockedIds] = useState(ISet())

  // `sharedIds` is a static parameter and shouldn't change during consensus
  // negotiation. If it does, we reset the consensus first.
  useEffect(() => {
    setLockedIds(ISet())
  }, [sharedIds])

  const disagreement = useMemo(() => {
    return disagreementIds.size > 0
  }, [disagreementIds])

  const disagree = useCallback(
    (id) => {
      // Just make all clientIds unique unless sharedIds = true
      // We still add an optional 'reason' for debugging.
      const uniqueId = sharedIds ? id : { reason: id }

      setLockedIds((iSet) => iSet.add(uniqueId))

      return () => setLockedIds((iSet) => iSet.delete(uniqueId))
    },
    [sharedIds]
  )

  // Explanation:
  // - disagree: break consensus - returns function for ending break.
  // - disagreement: true if no consensus
  return [disagree, disagreement]
}
