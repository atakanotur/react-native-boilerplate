# AI Development Rule Set for React Native Architect

This document serves as the **STRICT, UNAMBIGUOUS** constitution for all AI agents and engineers operating within this repository. Deviations from these rules are considered anti-patterns and are strictly forbidden.

## 1. Clean Code & Architecture Principles
- **ALWAYS** enforce the Single Responsibility Principle (SRP). Components must do one thing. If a component exceeds 150 lines, it MUST be broken down into smaller, colocated sub-components.
- **ALWAYS** use `camelCase` for directories, variables, and functions. Use `PascalCase` strictly for React components and Types/Interfaces. 
- **NEVER** use Magic Numbers or Strings. **ALWAYS** extract them into shared constants (e.g., `UI.spacing.md`).
- **ALWAYS** keep business logic decoupled from UI components. Extract complex logic into custom hooks (`/source/hooks` or feature-specific hooks).
- **NEVER** use `any`. **ALWAYS** strictly type every variable, return type, and function parameter. Use `unknown` with type narrowing if the shape is truly dynamic.

## 2. React & React Native Performance
- **NEVER** pass inline objects (e.g., `style={{ marginTop: 10 }}`) or inline arrays as props. **ALWAYS** use `StyleSheet.create` or `useMemo` to prevent unnecessary re-renders.
- **NEVER** pass anonymous functions (e.g., `onPress={() => doSomething()}`) directly in JSX. **ALWAYS** wrap them in `useCallback`.
- **ALWAYS** wrap custom UI components in `React.memo` and provide an explicit `displayName`.
- **ALWAYS** optimize `FlatList` or `FlashList` by providing `keyExtractor`, `getItemLayout`, `initialNumToRender`, and `windowSize`. **NEVER** use `index` as a key in dynamic lists.
- **ALWAYS** colocate state as close to where it is used as possible. Do not lift state globally unless it is shared across completely separate module branches.

## 3. Expo Ecosystem & Routing
- **ALWAYS** place Expo Router entry points and layouts inside `/app`. **NEVER** place business logic, complex UI components, or state management inside `/app`.
- **ALWAYS** implement the actual screen UI inside `/source/features/[feature]/screens` and import it into the `/app` wrapper.
- **ALWAYS** prefix client-safe environment variables with `EXPO_PUBLIC_`. **NEVER** expose sensitive secrets (like private API keys) in the JS bundle. Use secure backend proxying for sensitive keys.
- **ALWAYS** use strongly typed routes when navigating with Expo Router (`router.push('/(auth)/login')`).

## 4. State Management Synergy (Zustand + TanStack Query)
- **NEVER** duplicate server state in Zustand. **ALWAYS** use TanStack Query for data fetching, caching, and server state. Zustand is strictly for client-only state (e.g., active tabs, dark mode toggle, local session flags).
- **ALWAYS** declare TanStack Query keys using a centralized, strongly typed factory object (e.g., `authQueryKeys.all`).
- **ALWAYS** mutate data using `useMutation` and immediately update the local cache using `queryClient.setQueryData` for optimistic UI updates.
- **ALWAYS** export Zustand stores as custom hooks from a `.store.ts` file.

## 5. Styling Conventions (Custom Theme Architecture)
- **NEVER** use third-party styling libraries like Tailwind, NativeWind, or styled-components.
- **ALWAYS** extract styles into a co-located `.styles.ts` file (e.g., `Button.styles.ts` next to `Button.tsx`).
- **ALWAYS** use the `createStyles(colors)` factory function pattern to inject the current theme colors into the StyleSheet.
- **ALWAYS** consume colors via the `useTheme()` hook from the `theme` feature.
- **NEVER** hardcode color hex codes or numeric spacing values in `.tsx` files. Route all dimensions through the shared `UI` constants object.

## 6. Security & Storage
- **ALWAYS** use `expo-secure-store` or `react-native-keychain` for sensitive data (e.g., JWT tokens, PII).
- **NEVER** log sensitive information, auth tokens, or entire API responses to the console in production environments.
- **ALWAYS** handle token rotation via the established Axios interceptors and singleton `ApiClient`.
