# NOTES.md — Comparing Hand-Built Components to shadcn/ui

## Setup

Installed shadcn/ui and added its `dialog` and `tabs` components:


This generated `src/components/ui/dialog.jsx`, `src/components/ui/tabs.jsx`, and `src/components/ui/button.jsx`. Both generated files turned out to be thin wrappers around **Base UI** (`@base-ui/react`), a headless accessibility library — the actual ARIA/keyboard logic lives inside that library, not in the shadcn file itself.

## Dialog: What shadcn/Base UI Handled That I Missed

1. **Rendered via a Portal.** shadcn's `DialogContent` renders through `DialogPortal`, placing the dialog markup at the end of `document.body` rather than inline where it's declared. My hand-built `Modal` renders inline in the component tree, so if it were ever nested inside a parent with `overflow: hidden` or a low `z-index`, it could be visually clipped or hidden — something a portal avoids entirely.

2. **Background scroll is locked while open.** With shadcn's dialog, the page behind the dialog cannot be scrolled while it's open. My `Modal` does not do this — a user can still scroll the page behind an open modal, which is disorienting and technically lets a screen reader/keyboard user tab into unrelated background content in some browsers.

3. **Enter/exit animation states, not just visibility toggling.** shadcn tracks `data-open` / `data-closed` states so the dialog can animate out *before* being removed from the DOM. My `Modal` does `if (!isOpen) return null`, so it disappears instantly with no exit transition.

4. **A dedicated, linked description slot (`DialogDescription`).** shadcn provides both a title (`aria-labelledby`-equivalent) and a separate description linked via `aria-describedby`. I only linked a title (`aria-labelledby`) to my dialog — I never considered that a dialog's *purpose*, not just its *title*, should also be announced to screen reader users.

## Tabs: What shadcn/Base UI Handled That I Missed

1. **Vertical orientation support.** shadcn's `Tabs` accepts an `orientation` prop; in vertical mode, the expected arrow-key behavior switches from Left/Right to Up/Down automatically, per the ARIA Tabs pattern. My `Tabs` hard-codes horizontal Left/Right handling only — it would not meet the spec if used as a vertical tab list.

2. **A visible, keyboard-only focus indicator.** shadcn styles the active tab trigger with `focus-visible:ring-[...]`, which shows a clear focus ring when navigating by keyboard but *not* when clicking with a mouse. My `Tabs` has no custom focus style at all, relying on the browser's default outline — which is easy to lose track of, and is sometimes suppressed by global CSS resets. This is a direct miss against WCAG 2.4.7 (Focus Visible).

3. **Disabled-tab support.** shadcn's trigger styling already accounts for a `disabled`/`aria-disabled` state (dimmed, non-interactive, skipped by keyboard nav). I did not build any way to disable an individual tab.

## Overall Takeaway

Writing these components by hand made the ARIA Authoring Practices patterns (roles, `aria-selected`, roving `tabindex`, Escape-to-close, focus trapping) concrete rather than abstract — I understood *why* each attribute exists because I had to reason about the exact keyboard interaction it enables. But reading shadcn's source showed that a production-grade accessible component does more than satisfy the core ARIA pattern: it also handles portal rendering, scroll locking, animated open/close states, explicit focus-visible styling, and disabled-state handling — details that are easy to under-scope when building "just enough" to pass a manual keyboard test. The practical implication: for a real product, using a well-audited headless library (like Base UI, Radix, or React Aria) is usually safer than a hand-rolled component, precisely because of these easy-to-miss edge cases — but building one by hand first was what made it possible to actually evaluate whether a library's implementation is doing the right thing.