# AI Development Rule Set for React Native Architect

This document outlines the strict architectural and coding guidelines for this React Native project. Future AI agents and developers must adhere to these rules autonomously when modifying or generating code.

## 1. Tech Stack & Core Libraries

- **Framework:** Expo (~54) with React Native (0.81.5).
- **Navigation:** Expo Router (~6).
- **Language:** TypeScript (Strict mode enabled).
- **State Management:** Zustand (for client state) and TanStack React Query (for server state).
- **Networking:** Axios (Singleton pattern with interceptors).
- **Forms & Validation:** `react-hook-form` and `zod`.
- **Storage:** `react-native-keychain`, `@react-native-async-storage/async-storage`, and `expo-secure-store`.

**Rule:** Always use the defined tech stack. Do not introduce Redux, Context API (for global state), or fetch natively unless absolutely necessary and justified.

## 2. Architecture & Folder Structure

The project follows a Feature-Sliced modular architecture, separated from Expo Router's routing logic.

- `/app`: Strictly for Expo Router screens and layouts (`_layout.tsx`, `(tabs)`, `(auth)`). **Do not put business logic here.**
- `/source/features`: Contains isolated domain logic (e.g., `auth`, `theme`). Each feature must include specific subfolders as needed: `api`, `constants`, `queries`, `screens`, `store`, `types`.
- `/source/shared`: Contains globally reusable UI components (`/components/ui`, `/components/layout`) and constants.
- `/source/services`: Contains singleton services for networking and local device APIs (e.g., `api.ts`, `tokenManager.ts`).
- `/source/lib`: Contains setup and configuration for third-party tools (e.g., `queryClient.ts`).

### Strict Placement Rules:
- **New Screens:** Expo Router wrappers go to `/app`, but the actual UI implementation goes to `/source/features/[feature-name]/screens`.
- **New Components:** If reusable globally, place in `/source/shared/components`. If specific to a domain, place in `/source/features/[feature-name]/components`.
- **Imports:** Always use absolute path aliases starting with `@/source/...` or `@/app/...`.

## 3. Coding Standards & TypeScript

### Functional Components & Types
- **Always** use Named Exports. Never use `export default` (except for Expo Router files in `/app` which require it).
- **Always** define Prop interfaces explicitly. Extend React Native types when wrapping primitives.
- **Always** wrap UI components in `memo` and use `useCallback` / `useMemo` for performance optimization.
- **Always** add a `displayName` when using `memo`.

**Do:**
```tsx
import React, { memo } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';

export interface CustomComponentProps {
  label: string;
  style?: StyleProp<ViewStyle>;
}

export const CustomComponent = memo<CustomComponentProps>(({ label, style }) => {
  return <View style={style}>{/* ... */}</View>;
});

CustomComponent.displayName = 'CustomComponent';
```

**Don't:**
```tsx
export default function CustomComponent(props: any) { // No default exports, no 'any'
  return <View />
}
```

## 4. State Management & Data Fetching

### Server State (TanStack Query)
- **Always** define query keys in a centralized factory object (e.g., `authQueryKeys.all`).
- **Always** encapsulate `useQuery` and `useMutation` inside custom hooks exported from a `.queries.ts` file in the feature directory.
- Update cache optimistically or immediately upon mutation success via `queryClient.setQueryData`.

**Do:**
```typescript
export const featureQueryKeys = {
  all: ['feature'] as const,
  detail: (id: string) => [...featureQueryKeys.all, id] as const,
};

export function useFeatureDetail(id: string) {
  return useQuery({
    queryKey: featureQueryKeys.detail(id),
    queryFn: () => Api.getFeature(id),
  });
}
```

### Client State (Zustand)
- Use Zustand strictly for UI state or local session state.
- Create atomic stores inside `/source/features/[feature]/store/[feature].store.ts`.

## 5. Styling Conventions

The project does **not** use Tailwind or Styled Components. It relies on a custom Theme Hook and React Native's `StyleSheet`.

- **Always** extract styles into a separate `.styles.ts` file co-located with the component (e.g., `Button.styles.ts` next to `Button.tsx`).
- **Always** use the `createStyles` factory function pattern that accepts theme colors.
- **Always** fetch colors from the `useTheme()` hook.
- **Always** use global UI constants (e.g., `UI.spacing.sm`, `UI.button.borderRadius`) from `@/source/shared/constants/ui` instead of hardcoded numeric values.

**Do:**
```typescript
// Component.styles.ts
import { StyleSheet } from 'react-native';
import { ColorPalette } from '@/source/features/theme/types/theme.types';
import { UI } from '@/source/shared/constants/ui';

export const createStyles = (colors: ColorPalette) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: UI.spacing.md,
    borderRadius: UI.radius.md,
  }
});
```

```tsx
// Component.tsx
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/source/features/theme/hooks/useTheme';
import { createStyles } from './Component.styles';

export const Component = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return <View style={styles.container} />;
};
```

**Don't:**
- Never hardcode colors like `backgroundColor: '#000'`.
- Never define `StyleSheet.create` inside the `.tsx` file if using theme colors.
- Avoid inline styles.
