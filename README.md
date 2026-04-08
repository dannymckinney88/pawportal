# PawPortal

PawPortal is a mobile-first dog training follow-up app for private trainers.

It helps trainers clearly communicate what to work on after a session and track whether clients actually follow through — without requiring clients to log in.

---

## The Problem

Dog training often breaks down between sessions.

Trainers assign homework, but:

- clients forget what to practice
- instructions aren’t structured
- trainers have no visibility into follow-through

---

## The Solution

PawPortal turns each training session into a clear, trackable plan:

1. Trainer creates a session recap
2. Client receives a simple shareable link
3. Client completes homework directly on the page
4. Trainer sees engagement and follow-through

---

## Core Features

### Trainer Dashboard

- View all clients in one place
- See latest session engagement at a glance
- Identify clients that need follow-up
- Homework completion tracking per session

### Client Recap Page (Public)

- No login required
- Shareable session link (`/s/[token]`)
- Homework checklist with real-time progress
- Clear session summary
- Personalized notes for the dog

### Homework System

Each homework item supports:

- title
- description (context)
- step-by-step instructions
- resource links (videos/articles)
- dog-specific notes

Both **description and steps can be used together**.

### Session Engagement Tracking

Sessions track:

- first view
- last view
- homework completion

Derived engagement states:

- Not viewed
- Viewed
- In progress
- Completed

### Session Editing (Safe Updates)

Editing a session:

- preserves existing homework items when unchanged
- keeps client progress intact
- only updates, inserts, or removes what changed

### Client Lifecycle

- Archive clients to remove from dashboard
- Preserve full session history
- Designed for real trainer workflows

---

## Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Supabase**
  - Postgres (database)
  - Auth (trainer login)
  - Storage (dog photos)

---

## Project Structure

```txt
app/
  (trainer)/
    dashboard/
    clients/
    sessions/
    templates/
  s/[token]/        # public client recap page

lib/
  supabase/
  sessions/

components/
  shared UI and feature components
```

---

## Design Principles

### Keep it simple

- No unnecessary complexity. Focus on real trainer workflows.

### Be workflow-driven

Everything centers around:

- session → homework → follow-through

### Client friction must be zero

- no login required for clients
- clean, mobile-first UI
- fast interaction

### Preserve real-world behavior

- progress should never be lost
- edits should not break client experience
- trainers need visibility, not noise

---

## Current Status

MVP is functional with:

- trainer dashboard
- session creation/editing
- public recap pages
- homework completion tracking
- engagement visibility
- client archiving
- logout support

## Why PawPortal

- PawPortal is not a marketplace or social platform.

It’s a focused workflow tool that solves one core problem:

- **making training actually happen between sessions.**
