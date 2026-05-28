# ExamAITutor Design System

Global source of truth for ExamAITutor UI. Generated from `ui-ux-pro-max`, then normalized for the PRD: a trustworthy Nigerian UTME practice app for secondary school and pre-university students.

## Product Direction

- Style: Accessible & Ethical EdTech.
- Tone: calm, focused, encouraging, never childish.
- Primary user context: phone-first study sessions, low tolerance for clutter, clear progress feedback.
- Component stack: Next.js App Router, Tailwind v4, shadcn/ui base components.

## Tokens

| Role | Value | CSS variable |
| --- | --- | --- |
| Background | `#f8fafc` | `--background` |
| Foreground | `#0f172a` | `--foreground` |
| Card | `#ffffff` | `--card` |
| Card foreground | `#0f172a` | `--card-foreground` |
| Primary | `#1e3a8a` | `--primary` |
| Primary foreground | `#ffffff` | `--primary-foreground` |
| Secondary | `#f8f0cf` | `--secondary` |
| Secondary foreground | `#1f2937` | `--secondary-foreground` |
| Accent | `#047857` | `--accent` |
| Accent foreground | `#ffffff` | `--accent-foreground` |
| Muted | `#eef2f7` | `--muted` |
| Muted foreground | `#475569` | `--muted-foreground` |
| Border/Input | `#d8e0ec` | `--border`, `--input` |
| Destructive | `#dc2626` | `--destructive` |
| Ring | `#2563eb` | `--ring` |

## Typography

- Font: Outfit via `next/font/google`.
- Base text: 16px minimum, line-height 1.5-1.7.
- Headings: 600-700 weight, clear hierarchy, no negative letter spacing.
- Dashboard and cards: compact headings, not hero-scale type.

## Layout

- Mobile baseline: 375px viewport.
- Desktop container: `max-w-6xl` for app pages, `max-w-7xl` only for marketing.
- Avoid nested cards and decorative page-section cards.
- Use full-width bands or constrained unframed layouts for page sections.
- Touch targets: at least 44px high for primary controls.

## Interaction

- Every interactive control must have visible focus.
- Use semantic button variants and shadcn components before custom markup.
- Prefer clear labels over clever copy.
- Use motion only for state changes; respect `prefers-reduced-motion`.

## Avoid

- AI-purple gradients, one-note dark slate palettes, childish school-app fonts, emoji icons.
- Raw hex colors in components; use semantic Tailwind tokens.
- Text that describes how the UI works instead of letting controls speak for themselves.
