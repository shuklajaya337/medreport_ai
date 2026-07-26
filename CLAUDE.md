# Medical Report Explainer

## Project Overview
AI-powered web app that explains lab report values in simple language, with color-coded results (Normal/Borderline/Attention Needed) and multi-language support (English/Hindi).

## Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** JavaScript (not TypeScript)
- **Styling:** Tailwind CSS + Aceternity UI components
- **AI:** Google Gemini API (gemini-3.1-flash-lite model)
- **Animations:** Framer Motion / Motion

## Project Structure

src/
├── app/
│ ├── page.js # Main landing + report page
│ ├── layout.js # Root layout
│ ├── globals.css # Global styles
│ └── api/
│ └── analyze/
│ └── route.js # Gemini API endpoint
└── lib/
└── utils.js # Helper functions (cn utility)

## Environment Variables
- `GEMINI_API_KEY` — stored in `.env.local` (not committed to git)

## Key Features
- Report text input with type selector (CBC, Thyroid, Lipid Profile, Blood Sugar)
- AI-powered analysis with color-coded result cards
- Language toggle (English/Hindi)
- Medical disclaimer for responsible AI use

## Commands
- `npm run dev` — start development server
- `npm install <package>` — add new dependency

## Notes for Future Development
- All new components should use JavaScript (.jsx/.js), not TypeScript
- Follow existing Tailwind class patterns for consistency
- API responses from Gemini must be parsed as JSON (cleaned of markdown code fences)