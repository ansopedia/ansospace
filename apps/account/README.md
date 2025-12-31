# Account App

A comprehensive account management application built with Next.js 16, React 19, and the AnsoSpace SDK. This app provides a complete dashboard for users to manage their profile, security settings, sessions, and connected applications.

## Features

- ✅ **User Authentication** - Secure login, signup, and session management
- ✅ **Profile Management** - Update username, email, and profile picture
- ✅ **Security Settings** - Manage password, 2FA, and account security
- ✅ **Session Management** - View and manage active sessions across devices
- ✅ **Connected Apps** - Manage third-party application access
- ✅ **Responsive Design** - Mobile-first, fully responsive UI
- ✅ **Theme Support** - Light/dark mode with system preference detection
- ✅ **Cache Components** - Next.js 16 Cache Components for optimal performance

## Architecture

### Monorepo Structure

This app is part of a monorepo and follows a clear separation of concerns:

- **`packages/ui/`** - Shared UI components and blocks (reusable across all apps)
- **`packages/react/`** - React hooks and providers for AnsoSpace SDK
- **`packages/sdk/`** - Core SDK for API communication
- **`packages/types/`** - Shared TypeScript types
- **`apps/account/`** - This application (app-specific logic and pages)

### Component Architecture

#### Shared UI Components (`packages/ui/src/blocks/`)

Reusable UI blocks that can be used across all apps:

- **`UserMenu`** - User dropdown menu with profile and logout
- **`Navbar`** - Top navigation bar with sidebar trigger and user menu
- **`Footer`** - Application footer with links and copyright

#### App-Specific Components (`apps/account/src/app/(dashboard)/_components/`)

Components specific to the account app:

- **`DashboardNavbar`** - Dashboard-specific navbar with user data integration
- **`DashboardSidebar`** - Navigation sidebar with grouped menu items
- **`AccountOverview`** - Dashboard overview with account statistics

### Page Structure

```
apps/account/src/app/
├── (auth)/              # Authentication routes
│   ├── login/
│   ├── signup/
│   ├── forgot-password/
│   └── verify-email/
└── (dashboard)/          # Protected dashboard routes
    ├── layout.tsx        # Dashboard layout with sidebar, navbar, footer
    ├── page.tsx          # Dashboard home page
    ├── profile/          # Profile management
    ├── security/          # Security settings
    │   └── sessions/      # Active sessions management
    └── connected-apps/    # Connected applications
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn
- AnsoSpace API endpoint configured

### Installation

```bash
# Install dependencies from monorepo root
pnpm install

# Build all packages
pnpm build
```

### Environment Variables

Create a `.env.local` file in `apps/account/`:

```env
NEXT_PUBLIC_ANSO_SPACE_BASE_URL=https://api.ansospace.com
```

### Development

```bash
# Start the development server
cd apps/account
pnpm dev

# Or from monorepo root
pnpm --filter account dev
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
# Build the application
pnpm --filter account build

# Start production server
pnpm --filter account start
```

## Key Features Implementation

### Authentication Flow

The app uses Next.js Server Components with Cache Components for optimal performance:

1. **Server-Side User Fetching** - User data is fetched on the server using `getServerUser()`
2. **Client-Side State** - React Context provides user state to client components
3. **Suspense Boundaries** - Runtime data (cookies) is wrapped in Suspense for proper streaming

```tsx
// Server Component - Fetches user data
async function UserProvider({ children }) {
  const initialUser = await getServerUser();
  return <AuthProvider initialUser={initialUser}>{children}</AuthProvider>;
}

// Client Component - Uses user data
function DashboardNavbar() {
  const { user, email } = useUser();
  // ...
}
```

### Dashboard Layout

The dashboard uses a three-part layout:

1. **Sidebar** - Collapsible navigation menu with grouped items
2. **Navbar** - Top bar with user menu and theme toggle
3. **Footer** - Bottom footer with links

All components are responsive and work seamlessly on mobile devices.

### Profile Management

- **Update Username** - Validated username updates with branded types
- **Update Email** - Email validation and updates
- **Change Password** - Secure password change with current password verification
- **Profile Picture** - Placeholder for future avatar upload functionality

### Security Features

- **Active Sessions** - View all active sessions with device information
- **Session Management** - Revoke individual sessions
- **Password Management** - Change password with validation
- **2FA Support** - Placeholder for two-factor authentication

## Code Organization

### Server Actions

Server actions are located in `_components/action.ts` files:

```tsx
// apps/account/src/app/(dashboard)/profile/_components/action.ts
"use server";

export const updateProfileAction = async (data: UpdateUser) => {
  const sdk = await getServerSdk();
  return await sdk.users.updateProfile(data);
};
```

### Client Components

Client components use React hooks from `@ansospace/react`:

```tsx
import { useLogout, useUser } from "@ansospace/react";

function MyComponent() {
  const { user, email } = useUser();
  const { mutate: logout } = useLogout();
  // ...
}
```

### Shared UI Blocks

UI blocks in `packages/ui/src/blocks/` are pure, reusable components:

```tsx
// Pure UI component - no business logic
export const UserMenu = ({ name, email, onLogout, ... }) => {
  return <DropdownMenu>...</DropdownMenu>;
};

// App-specific wrapper - adds business logic
export const DashboardNavbar = () => {
  const { user } = useUser();
  return <Navbar userMenu={{ name: user.username, ... }} />;
};
```

## Styling

The app uses:

- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Accessible component library
- **CSS Variables** - For theming (light/dark mode)

## Testing

```bash
# Run type checking
pnpm --filter account typecheck

# Run linting
pnpm --filter account lint
```

## Deployment

The app is configured for deployment on platforms like Vercel, Netlify, or any Node.js hosting:

1. Set environment variables in your hosting platform
2. Build the app: `pnpm build`
3. Deploy the `.next` output

## Contributing

When adding new features:

1. **Shared UI** → Add to `packages/ui/src/blocks/`
2. **App Logic** → Add to `apps/account/src/`
3. **Types** → Add to `packages/types/src/`
4. **SDK Methods** → Add to `packages/sdk/src/`

## License

MIT
