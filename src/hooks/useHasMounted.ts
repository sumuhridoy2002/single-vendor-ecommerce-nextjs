import { useSyncExternalStore } from "react"

let clientMounted = false

function subscribe(onStoreChange: () => void) {
  queueMicrotask(() => {
    if (!clientMounted) {
      clientMounted = true
    }
    onStoreChange()
  })
  return () => {}
}

function getSnapshot() {
  return clientMounted
}

function getServerSnapshot() {
  return false
}

/** True after the first client commit (post-hydration microtask). SSR and the first client render see `false`, matching markup and avoiding hydration mismatches. */
export function useHasMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
