`useConsensus`: returns `[disagree, disagreement]` where `disagree` is a function to break consensus, and `disagreement` is true if any consumer disagrees.
`disagree` returns a function to cancel the own disagreement.

`useEventCallback`: The one from the [react docs](https://reactjs.org/docs/hooks-faq.html)