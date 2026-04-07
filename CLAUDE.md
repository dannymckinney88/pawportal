@AGENTS.md

# PawPortal — Claude Guidelines

## Stack

- Next.js 15 (App Router), TypeScript, Tailwind CSS v4
- Supabase (Postgres, Auth, Storage)
- No src/ directory — app/ is at root

## Code Style

- Async server components for data fetching, client components only when needed
- Always await params in server components: `const { id } = await params`
- Use @/lib/supabase/server for server components, @/lib/supabase/client for client components
- Escape apostrophes in JSX with &apos;

## Design & Style

- Mobile first — build for phone screen first, scale up with sm: md: lg: breakpoints
- Tailwind only — no inline styles, no external CSS files, no extra UI libraries
- Spacing scale: use p-4 px-4 py-8 for consistency — avoid arbitrary values
- Border radius: rounded-lg for inputs, rounded-2xl for cards and containers
- Shadows: shadow-sm default, shadow-md on hover for interactive cards
- Typography: text-sm for body/labels, text-base for normal text, text-xl+ for headings
- Gray scale: gray-50 for page backgrounds, white for cards, gray-900 for headings, gray-500 for secondary text, gray-400 for placeholders
- Blue scale: blue-600 for primary actions, blue-700 on hover, blue-100 for subtle backgrounds
- Interactive states: always include hover: and focus: variants — never static only
- Destructive actions: red-500 for errors and delete, never blue or gray
- Empty states: centered, paw emoji 🐾, short gray-400 message, action link below
- Loading states: disabled button with opacity-50 and descriptive text like "Saving..."
- Cards: bg-white rounded-2xl p-4 shadow-sm — consistent across all list items
- Page layout: max-w-4xl for dashboard/lists, max-w-lg for forms — always mx-auto px-4

## Mobile First Rules

- Default styles are mobile — never assume desktop
- Tap targets minimum 44px height on all buttons and links
- Bottom-heavy layouts on mobile — primary actions near thumb reach
- Avoid hover-only interactions — all functionality must work on touch
- Stack vertically on mobile, grid on sm: and above
- Font size minimum text-sm — never smaller on mobile
- Full width buttons on mobile: w-full, auto width on sm: if needed

## Accessibility (Non-Negotiable)

- Every input must have a visible <label> with htmlFor matching the input id
- Required fields marked with aria-required="true" and visual indicator
- Error messages must use role="alert" so screen readers announce them
- Buttons must have descriptive text — never just "Submit" or "Click here"
- Images always need meaningful alt text — dog photos use the dog's name
- Forms must use <form> with onSubmit — never onClick-only submission
- Focus states must be visible — never remove outline without a replacement
- Color alone must never convey meaning — always pair with text or icon
- Touch targets minimum 44x44px on mobile

## Security

- Never use the service_role key in frontend code
- Always verify auth.uid() matches trainer_id before any data operation
- RLS handles authorization — never skip it or work around it
- Tokens for client-facing pages are UUID-based — never sequential or guessable
- Never expose other trainers' client data — all queries filter by trainer_id
- .env.local is never committed — verify before every push

## Database

- trainers.id is a UUID tied directly to auth.users
- All other tables use gen_random_uuid() for IDs
- Cascade deletes are set — deleting a trainer removes all their data
- sessions.token is the public identifier for client-facing pages — treat as read-only after creation

## File Structure

- app/(auth)/ — login, unauthenticated routes
- app/(trainer)/ — all authenticated trainer routes
- app/s/[token]/ — public client-facing session page, no auth required
- components/trainer/ — trainer dashboard components
- components/client/ — client-facing page components
- lib/supabase/ — client.ts and server.ts only

## What Not to Do

- Do not use <img> — use Next.js <Image /> from next/image
- Do not hardcode trainer IDs or UUIDs
- Do not add dependencies without checking if native or existing solution works
- Do not remove aria attributes or accessibility features to fix layout issues
- Do not use shadcn or any component library — build with Tailwind only
