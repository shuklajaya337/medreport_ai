# Workflow Comparison: Vague vs Precise Prompting

## Feature Built
A Settings form with Name, Email, and Language preference fields, including validation.

## Round 1: Vague Prompt
**Prompt used:** "Make a settings form"

**Output characteristics:**
- Basic inline styles (no Tailwind, inconsistent with rest of the project)
- No validation — empty name and invalid email formats were both accepted and "saved"
- No accessibility attributes — labels were not programmatically connected to inputs via `htmlFor`/`id`
- Used `alert()` for feedback, a blocking, poor-UX pattern
- No error states or messages
- No tests written

## Round 2: Precise Prompt
**Prompt used:** Specified exact file path (`src/app/settings/page.js`), required Tailwind CSS for styling consistency with the rest of the app, required validation rules (name required, email must match a valid email pattern), required accessibility (`htmlFor`, `aria-invalid`, `aria-describedby`, `role="alert"`), required inline success/error messaging instead of `alert()`, and required a verification step — write the component, then write and run tests.

**Output characteristics:**
- Tailwind CSS matching the app's existing design system
- Full validation with specific error messages per field
- Accessible form: labels linked to inputs, ARIA attributes for error states, `role="alert"` for screen readers
- Inline success confirmation instead of a blocking alert
- 3 Jest + React Testing Library tests covering: empty name validation, invalid email validation, and successful submission

## Diff Summary
- **Correctness:** Round 1 accepted any input silently; Round 2 correctly rejects empty names and malformed emails with specific messages.
- **Accessibility:** Round 1 had zero ARIA/label wiring; Round 2 passes basic screen-reader expectations (`htmlFor`, `aria-invalid`, `role="alert"`).
- **Edge cases:** Round 1 didn't handle an invalid email format at all (e.g., "notanemail" was accepted); Round 2 explicitly regex-validates email format.
- **Review effort:** Round 1 required near-total rewriting to be production-usable. Round 2 required only one config fix during test setup (see below) — the component code itself needed no changes after review.

## AI Mistake Caught
While setting up Jest for the verification step, the generated `jest.config.js` used the key `setupFilesAfterEach` instead of the correct Jest config option `setupFilesAfterEnv`. This silently prevented `jest.setup.js` (which imports `@testing-library/jest-dom`) from loading, causing all `toBeInTheDocument()` calls to fail with `TypeError: ... is not a function`. This was caught by actually running the tests rather than assuming they'd pass, and was fixed by correcting the config key.

## Takeaway
The vague prompt produced something that *looked* functional in a quick visual check but would have failed real users (no validation) and accessibility audits. The precise prompt, paired with an explicit verification step, caught issues before they shipped — including a config-level bug that had nothing to do with the "creative" part of the task. Precise specs plus a "write it, then test it" loop meaningfully reduced review effort on my end.