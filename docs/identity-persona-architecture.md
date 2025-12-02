# One Identity, Many Personas: Profile Management Architecture

## Core Philosophy

Adopt a model where a single global identity can have multiple app-specific personas.

- Global Account (`account.ansospace.com`): Central place to manage login security and **Personally Identifiable Information (PII)** (name, email, password, 2FA, avatar).
- App Profiles (e.g., `ansopedia.com`, `delivery.ansospace.com`): Each app manages its own contextual profile data and visibility.
- Goal: Allow users to be professional in one app and anonymous in another without privacy conflicts.

## Routing Strategy

Use clear routes per domain to separate concerns.

- Manage Account: `account.ansospace.com/profile` — Edit global name, email, password, 2FA, avatar.
- Manage Privacy: `account.ansospace.com/security` — Log out of all devices, delete account.
- Public Profile Hub (optional): `ansospace.com/u/[username]` — Linktree-style card listing connected apps.
- EdTech Profile: `ansopedia.com/u/[username]` — Courses, university, academic stats.
- Delivery Profile: `delivery.ansospace.com/driver/[id]` — Driver rating, deliveries completed.
- Contextual Search: `ansopedia.com/search/people` — Searches only students/teachers.

## Architecture & Data Flow

Strict separation between User Service (Global Identity) and App Services (Local Personas).

### Database Schema Strategy

- User Service DB (Global Identity)
  - Table: `users`
  - Columns: `id` (UUID), `username` (unique), `email`, `avatar_url`, `is_verified`
  - Responsibility: Single source of truth for identity and PII.

- Ansopedia Service DB (Contextual Profile)
  - Table: `student_profiles`
  - Columns: `user_id` (FK → Global), `university_id`, `bio`, `enrolled_courses`, `badges`

- Delivery Service DB (Contextual Profile)
  - Table: `driver_profiles`
  - Columns: `user_id` (FK → Global), `license_number`, `vehicle_type`, `rating`

## Editing & Synchronization

Route edits to the correct domain based on data type.

- Password or Email (PII)
  - User clicks “Settings” on an app → redirect to `account.ansospace.com/security`
  - User changes credentials → redirect back to the app

- Avatar and Bio
  - Avatar: Start with Global (edit at `account.ansospace.com`). All apps update.
  - Bio: Local (e.g., edit at `ansopedia.com/settings`). Stored in app’s profile table.

## Search & Filters Architecture

Distributed search per app, with identity enrichment.

- Frontend: `ansopedia.com/search?q=krishna&university=TU`
- Backend: Queries app-specific tables (e.g., `student_profiles`).
- Enrichment: Join/fetch latest avatar and username from User Service.
- Optimization (Projector via Events):
  - User Service emits `USER_UPDATED { id, name, avatar_url }`
  - App services consume events and update local cache fields
  - Search stays fast and scoped within each app’s DB

## Console / Admin (Meta Business Equivalent)

Provide a separate admin console aggregating multi-service data.

- Domain: `console.ansospace.com` or `app.ansopedia.com/admin`
- Users: University admins, delivery fleet managers
- Tech: Separate Next.js app (`apps/console`) using `@ansospace/auth`

## Summary Checklist

- Routing
  - `account.ansospace.com` → Global identity (name, email, security)
  - `[product].ansospace.com/u/[username]` → Public persona
  - `[product].ansospace.com/settings` → Local preferences

- Data
  - Store `username` and `avatar` globally
  - Replicate to local services via events/webhooks for fast search

- Search
  - Build search per app, not global
  - Use local caches for name/avatar to avoid cross-service hot paths

This architecture delivers a “one account” feel while enabling rich, context-aware personas across your ecosystem.
