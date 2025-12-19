# Ansospace

## Overview

Ansospace is a cutting-edge developer ecosystem and platform designed to power a suite of modular, secure, and scalable internal tools and microservices for software products—enabling rapid building and scaling of SaaS applications. It provides reusable SDKs, core services, and a unified developer experience across web and mobile products.

Our mission is to create a product-ready, future-proof platform that supports multiple applications (from Learning Management Systems to delivery and finance tracking) by reusing shared resources like authentication, notifications, analytics, UI kits, and more.

## Key Features

Modular monorepo architecture (ansospace) hosting reusable SDKs and internal tools like auth, notifications, gamification, chat, SEO, analytics, and UI design systems.

Polyrepo microservices for independent, versioned backend services like user management, billing, content management, media processing, and quiz evaluations.

Product-specific polyrepos encapsulating web and admin apps plus product-specific backend services, enabling isolated yet collaborative development.

Dedicated mobile monorepo (ansomobile) housing React Native SDKs and mobile apps, sharing core mobile components and utilities.

Security-first approach: JWT-based authentication, Role-Based Access Control (RBAC), OAuth2 PKCE for native apps, and runtime validation with Zod schemas.

DevOps and CI/CD workflows powered by pnpm, turborepo, GitHub Actions, Vercel, Railway/Fly.io, and observability tools like Sentry and PostHog.

Extensible and reusable: Each new product leverages shared platform components to accelerate development and reduce duplication.

## Vision

Ansospace aims to become the foundational ecosystem powering all current and future applications internally and for clients. By fostering an “ecosystem-first” mindset, every feature and product developed reuses core platform resources, enabling rapid innovation without reinvention.

## 🧱 Core Architecture

### 1. **Monorepo: `ansospace`**

> Frontend foundation & plugin SDKs

- **apps/web**: public-facing frontends | domain (ansospace.com)
- **apps/dashboard**: global super-admin dashboard (app.ansospace.com)
- **apps/accounts**: global authentication pages (login, register, account management) (account.ansospace.com (profile page dashboard), account.ansospace.com/login, account.ansospace.com/signup, ...)
- **apps/docs**: documentation site
- **packages/**: publishable, reusable SDKs and shared libraries

#### Core Packages under `packages/`

- `@ansospace/sdk`: Platform-agnostic SDK for all data fetching (replaces Clerk/Auth0)
  - HTTP client with automatic token management
  - Modular resource-based architecture (AuthResource, UserResource, etc.)
  - Works on Node.js, Web, and Mobile
- `@ansospace/react`: React integration layer
  - Hooks (useLogin, useUser, useOtpActions, etc.)
  - Context providers (AnsospaceProvider)
  - Platform-specific storage adapters (BrowserStorageAdapter)
- `@ansospace/types`: Shared TypeScript types and Zod schemas
- `@ansospace/ui`: Design system and UI components
- `@ansospace/notify`: self-hostable Mailgun/OneSignal alternative (planned)
- `gamification-kit`: leaderboards, XP, badges (planned)
- `@ansospace/chat`: reusable internal chat layer (planned)
- `analytics-kit`: for metadata and business intelligence (planned)

> ⚡ **Note:** `ansospace` is an internal-use-only foundation and landing site for platform marketing.

### 2. **Microservices** (Polyrepo)

Each is independently deployable, versioned, and language-agnostic.

| Repo                   | Responsibility                        |
| ---------------------- | ------------------------------------- |
| `user-service`         | User identity, roles, RBAC            |
| `notification-service` | Email, push, in-app events            |
| `cms`                  | Blogs, course content, FAQs           |
| `media-service`        | Image uploads, file processing        |
| `billing-service`      | Stripe/webhooks, plans, subscription  |
| `institute-service`    | Colleges, schools, rankings, metadata |
| `quiz-service`         | Create, evaluate, rank quizzes        |

Each service:

- Exposes a REST/gRPC/OpenAPI interface
- Uses Zod/Schema contracts from `@ansospace/types`
- Auth via `@ansospace/sdk`
- Traced via `analytics-kit` (planned)

### 3. **Modular Product Apps (Polyrepos per Product)**

Each product (e.g., LMS, delivery app, school system) should have **separate polyrepos** with the following suggested structure:

```bash
<product-name>-platform/
├── apps/
│   ├── web/               # Public-facing web app (Next.js)
│   ├── admin/             # Admin panel for managing product-specific logic
├── services/
│   └── <business-service> # Core backend logic
├── packages/
│   └── types/             # App-specific types or utils (optionally share with ansospace)
├── .env.local             # Environment config for local
├── README.md              # Scope and responsibility
```

> ❌ Do NOT include `mobile/` here to avoid bloating dev workflows.

### 4. **Shared Mobile Monorepo: `ansomobile`**

> React Native SDKs & Apps

```bash
ansomobile/
├── apps/
│   ├── delivery-app/       # Mobile delivery app (Expo)
│   ├── lms-app/            # LMS student app
│   ├── school-app/         # School management mobile
├── packages/
│   ├── ui/                 # Reusable native components
│   ├── sdk/                # Platform-agnostic SDK (shared with ansospace)
│   ├── react/              # React Native integration (hooks, providers)
│   ├── notification-kit/   # Mobile notifications + Firebase
│   └── types/              # Shared types with ansospace
├── README.md
```

### 5. **GitHub Organization Strategy**

Organize your GitHub repos into **teams/folders** using GitHub Projects or naming convention:

#### ⬇️ Recommended Repo Naming

| Scope        | Example Repo                                           | Purpose                            |
| ------------ | ------------------------------------------------------ | ---------------------------------- |
| Shared Infra | `ansospace`                                            | Internal monorepo + landing        |
| SDKs/Plugins | `@ansospace/sdk`, `@ansospace/react`, `chat-kit`, etc. | Independent toolkits (npm-publish) |
| Mobile       | `ansomobile`                                           | React Native workspace             |
| LMS          | `lms-platform`, `lms-service`                          | Product polyrepo                   |
| Delivery     | `delivery-platform`, `delivery-service`                | Delivery business logic            |
| School       | `school-platform`, `school-service`                    | School management system           |
| Services     | `user-service`, `notification-service`                 | Core backend microservices         |

> ✅ Use `platform` suffix for polyrepo apps
> ✅ Use `service` suffix for backends

## 🔐 Security by Default

- Zod-based runtime validation for all configs (via `@ansospace/types`)
- JWT & RBAC handled in `@ansospace/sdk`
- Role-level UI in `apps/dashboard`
- Use OAuth2 PKCE flows for native apps
- API gateway restricts service exposure
- Internal CLI for secrets management (TBD)

## 🏗️ Developer Experience

- `pnpm` + `turborepo`: workspace management
- `changesets`: controlled versioning for publishable packages
- `eslint`, `prettier`, `tsconfig` unified via `@ansospace/config`
- `storybook` for UI packages (planned)
- `nx` or `bazel` optionally later for complex service graph

## 📆 Future-Proofing: All Apps Plug-and-Play

Each new app should:

- Consume from `@ansospace/*` SDKs:
  - `@ansospace/sdk` for platform-agnostic data fetching
  - `@ansospace/react` for React hooks and state management (web)
  - `@ansospace/types` for shared type definitions
- Share UI via `@ansospace/ui`
- Deploy from own polyrepo with shared internal deps
- Integrate with base microservices (user, media, analytics, etc.)
- Ship mobile using `ansomobile` workspace (uses `@ansospace/sdk` + React Native adapters)

### Example: School Management System

Uses:

- `@ansospace/sdk` + `@ansospace/react` for authentication
- `user-service` for user management
- `notification-kit` for report cards (planned)
- `quiz-service` for assessments
- `cms` for content
- `chat-kit` for parent-teacher chat (planned)
- `billing-service` for fees
- Mobile app from `ansomobile/school-app`

## 🚀 Platform Tooling

- GitHub Actions: CI/CD + publish + tests
- Vercel: frontend hosting
- Railway/Fly.io: microservices
- Sentry/PostHog: logging/telemetry
- Neon/Supabase: storage

## 📚 Documentation

- Each repo contains a `SCOPE.md`
- Root docs: `docs/architecture.md`, `docs/tooling.md`, `docs/onboarding.md`

## 📍 Strategy Summary

- ✅ **Reusable SDKs** in monorepo
- ✅ **Stateless, versioned microservices** for logic separation
- ✅ **Zero-vendor lock-in**: no Mailgun, Clerk, etc.
- ✅ **Frontend-ready platform** with shared UI + auth + analytics
- ✅ **Future apps reuse without reinvention**
- ✅ **Dev-friendly, CI/CD-first, open-core architecture**
- ✅ **Modular polyrepos for product scaling (web, admin, mobile, service)**
- ✅ **Dedicated mobile monorepo (`ansomobile`) for scalable native apps**
- ✅ **Platform tooling for seamless deployment, logging, and analytics**
