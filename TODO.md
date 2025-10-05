# TODO: Create @ansospace/auth Package

## 1. Create Package Structure

- [x] Create `tools/auth/` directory
- [x] Create `tools/auth/package.json`
- [x] Create `tools/auth/tsconfig.json`
- [x] Create `tools/auth/src/` directory structure
- [x] Create `tools/auth/README.md`

## 2. Implement API Client

- [x] Create `src/apiClient.ts` with platform-agnostic HTTP client
- [x] Implement token refresh logic with request queuing
- [x] Abstract token retrieval/storage via callbacks

## 3. Create Context and Provider

- [x] Create `src/context/AuthContext.tsx`
- [x] Create `src/providers/AuthProvider.tsx`
- [x] Implement auth state management

## 4. Implement Hooks

- [x] Create `src/hooks/useAuth.ts` (exported from context)
- [x] Create `src/hooks/useLogin.ts`
- [x] Create `src/hooks/useSignup.ts`
- [x] Create `src/hooks/useLogout.ts`
- [ ] Create `src/hooks/useOtp.ts`

## 5. Add Utils and Types

- [x] Create `src/utils/tokenManager.ts`
- [ ] Create `src/types/index.ts`
- [x] Create `src/index.ts` for exports

## 6. Testing and Documentation

- [x] Add unit tests for hooks and utils (skipped as per user request)
- [x] Update README with usage examples
- [x] Ensure compatibility with React Native and Next.js
