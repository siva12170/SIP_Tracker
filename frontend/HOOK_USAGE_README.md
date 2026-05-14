# Frontend Hook Usage

This file lists frontend files that currently use React hooks such as `useContext`, `useEffect`, and related hooks.

## Files Using Hooks

- `src/contexts/dashboard-data-context.tsx`
  - `createContext`
  - `useContext`
  - `useEffect`
  - `useMemo`
  - `useState`

- `src/components/dashboard/dashboard-content.tsx`
  - `useMemo`

- `src/components/auth/auth-gate.tsx`
  - `useEffect`
  - `useState`

- `src/components/layout/sidebar.tsx`
  - `useEffect`
  - `useState`

- `src/app/login/page.tsx`
  - `useState`

- `src/app/register/page.tsx`
  - `useState`

- `src/store/hooks.ts`
  - `useDispatch`
  - `useSelector`

## React Redux Store

Redux store is now implemented and used in the frontend.

- Store setup: `src/store/index.ts`
- Auth slice: `src/store/slices/auth-slice.ts`
- Provider: `src/providers/redux-provider.tsx`
- App wrapper: `src/app/layout.tsx`
- Redux usage in auth flow:
  - `src/app/login/page.tsx`
  - `src/components/auth/auth-gate.tsx`
  - `src/components/layout/sidebar.tsx`

## Hooks Not Found In Frontend (Current Scan)

The following hooks were searched but not found in `src` at this time:

- `useCallback`
- `useRef`
- `useReducer`

## Notes

- Scan scope: `frontend/src/**/*.{ts,tsx}`
- This reflects the current codebase state as of the latest update.
