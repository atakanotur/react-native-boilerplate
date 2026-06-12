import { useEffect, useRef } from 'react'
import { Stack, router, SplashScreen } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useInitializeAuth } from '@/source/features/auth/queries/auth.queries'
import { useAuthStore, selectRouteState } from '@/source/features/auth/store/auth.store'
import type { UserProfile } from '@/source/features/auth/store/auth.store'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const { isAuthenticated, isInitializing } = useAuthStore(selectRouteState)
  const setInitialized = useAuthStore((s) => s.setInitialized)

  // Prevents router.replace() from firing on every re-render after the
  // initial redirect. This is the core fix for the infinite loop.
  const hasRedirected = useRef(false)

  // ── 1. Run silent auth via React Query ─────────────────────────────────
  // staleTime: Infinity + retry: false = runs exactly once per app launch
  const { data: sessionUser, status } = useInitializeAuth()

  // ── 2. Bridge RQ result → Zustand session state ─────────────────────────
  // Fires once when the query settles to 'success' or 'error'
  useEffect(() => {
    if (status === 'pending') return

    const resolvedUser = status === 'success' ? (sessionUser ?? null) : null
    setInitialized(resolvedUser as UserProfile | null)
  }, [status, sessionUser, setInitialized])

  // ── 3. Hide splash + redirect — guarded to fire exactly once ───────────
  useEffect(() => {
    // Still initializing — keep splash visible
    if (isInitializing) return

    // Already redirected — do not run again on subsequent re-renders
    if (hasRedirected.current) return

    hasRedirected.current = true
    SplashScreen.hideAsync()

    if (isAuthenticated) {
      router.replace('/(protected)/(main)')
    } else {
      router.replace('/(auth)/login')
    }
  }, [isAuthenticated, isInitializing])

  return (
    <QueryClientProvider client={queryClient}>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          {/*
        * Route groups are file-system driven:
        *   (auth)  — login, register, forgot-password  [public]
        *   (tabs)  — main app tabs                     [protected]
        */}
        </Stack>
    </QueryClientProvider>
  )
}