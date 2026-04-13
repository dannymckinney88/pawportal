# PawPortal — Claude Working Guidelines

## Overview

PawPortal is a mobile-first dog training follow-up app for private trainers.

**Core flow:**

- Trainer creates clients
- Trainer logs session recaps
- Sessions include summary, homework, steps, and notes
- Client receives a shareable recap link
- Client can mark homework complete
- Trainer can reuse templates
- Trainer can upload/update dog photos

This is a **workflow tool**, not a marketplace or social app.

---

## Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (@theme inline tokens)
- **Backend:** Supabase (Postgres, Auth, Storage)
- **Structure:** Project uses `app/` at root (no `src/`)

---

## Core Principles

### Keep it simple

- Avoid over-engineering.
- Prefer clarity over cleverness.

### Be surgical

- Small, focused changes only.
- **Do NOT** refactor large areas unless explicitly asked.
- **Do NOT** rewrite working code.

### Respect structure

- Route-specific components stay near routes.
- Shared components only when truly reusable.
- No unnecessary abstractions.

### No fake reuse

- Do not extract components “just in case.”

---

## Code Rules

- Use **async server components** for data fetching.
- Use client components only when necessary.
- Always await params:

  ```ts
  const { id } = await params;
  ```

- **Supabase Instantiation:**
  - Use `@/lib/supabase/server` for Server Components.
  - Use `@/lib/supabase/client` for Client Components.
- Escape apostrophes in JSX using `&apos;`.

---

## Styling System (STRICT)

We use **semantic tokens only** — never raw colors.

| Type            | Allowed Tokens                                                                                  |
| :-------------- | :---------------------------------------------------------------------------------------------- |
| **Backgrounds** | `bg-background`, `bg-card`, `bg-primary`, `bg-secondary`, `bg-accent`, `hover:bg-primary-hover` |
| **Text**        | `text-foreground`, `text-muted-foreground`, `text-label`, `text-hint`, `text-danger`            |
| **Borders**     | `border-border`                                                                                 |

> **Prohibited:** Never introduce `text-gray-*`, `bg-blue-*`, or `text-red-*` unless explicitly told.

---

## UI System Rules (IMPORTANT)

### Color Hierarchy

- **Primary (green)** → standard workflow actions (Save, Add, Create)
- **CTA (amber)** → entry / conversion / high-emphasis actions (Login)
- **Secondary (gray)** → neutral supporting actions
- **Danger (red)** → destructive actions
- **Accent / Accent-Subtle** → decorative surfaces and highlights

> Do NOT use CTA for all buttons.
> Workflow actions must remain primary.

---

### Shared UI Primitives

We use small reusable primitives for repeated patterns:

- `Button`
- `Input`

#### Button

- Variants:
  - `primary`
  - `secondary`
  - `cta`
  - `danger`
- Includes:
  - hover
  - focus-visible ring
  - disabled states

#### Input

- Shared styling for all text inputs
- Includes:
  - muted background
  - hover + focus states
  - accessible placeholder styling

> Only use primitives where patterns are consistent.
> Do NOT force all actions into Button.

---

### Interaction Rules

- Primary buttons:
  - lift on hover (`-translate-y-0.5`)
- Focus:
  - always visible (`focus-visible:ring-2`)
- Inputs:
  - must have hover + focus states

---

### When NOT to use Button

Keep these as text or custom actions:

- Back links
- Update photo
- Copy link (stateful)
- Inline row actions
- Navigation links

---

## Design System

### Layout & Spacing

- **Mobile-first always.**
- `max-w-4xl` → dashboards/lists.
- `max-w-lg` → forms.
- Always use `mx-auto px-4`.
- **Spacing Scale:** Use `p-4`, `p-6`, `gap-4`, `gap-6`, `gap-8`. Avoid arbitrary values.

### Components

- **Cards:** `bg-card rounded-2xl p-5/6 shadow-sm`.
  - _Hover state:_ `hover:-translate-y-0.5 hover:shadow-md`.
- **Typography:**
  - `text-sm` → labels/body.
  - `text-base` → standard content.
  - `text-xl+` → headings.
- **Buttons:**
  - Minimum height: `min-h-11` (mobile tap target).
  - Must include `hover`, `focus`, and `disabled` states.
  - _Example:_ `className="bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-2"`

### Mobile First Rules

- Default = mobile styling.
- No hover-only behavior.
- Buttons are **full width** on mobile (`w-full`), stack vertically, and enhance with `sm:` breakpoint.
- Tap targets $\ge$ 44px.
- Never use text smaller than `text-sm`.

---

## Accessibility (NON-NEGOTIABLE)

- **Labels:** Every input must have a `<label>` with `htmlFor`.
- **Required Fields:** Visual indicator + `aria-required="true"`.
- **Errors:** Use `role="alert"`.
- **Buttons:** Descriptive labels (avoid generic "Submit").
- **Images:** Meaningful `alt` text (e.g., dog name).
- **Forms:** Must use `<form onSubmit>`.
- **Focus:** Never remove outline without providing a replacement.

---

## Data & Security

- **Supabase:**
  - Never hardcode URLs or keys; use env variables.
  - Storage bucket: `dog_photos`.
  - Never use `service_role` in the frontend.
  - Always filter by `trainer_id` and verify `auth.uid()` ownership.
  - Tokens must be UUID-based (non-guessable).
- **Database:**
  - `trainers.id` tied to `auth.users`.
  - UUIDs everywhere; Cascade deletes enabled.
  - `sessions.token` is the public identifier (read-only after creation).

---

## File Structure

- `app/(auth)/` → Login/Auth flow.
- `app/(trainer)/` → Authenticated dashboard.
- `app/s/[token]/` → Public client recap page.
- `lib/supabase/` → Client and server utilities.

---

## What NOT to Do

- **Do NOT** use `<img>` → use `next/image`.
- **Do NOT** hardcode IDs.
- **Do NOT** add dependencies without need.
- **Do NOT** remove accessibility features.
- **Do NOT** introduce UI libraries (e.g., no shadcn).

---

## Current Focus

We are in the **polish + refinement** phase.

- **Focus on:** Spacing, hierarchy, interaction states, and small UX improvements.
- **Avoid:** Large new feature systems or premature gamification.
