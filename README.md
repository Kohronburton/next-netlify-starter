# ServiceFlow Catering Operations Demo

A polished, interactive demo showing how to turn a Claude-powered catering workflow into a reliable operations product.

## What the demo proves

- Google Sheets can remain the source of truth.
- Guest counts and recipe scaling are handled deterministically in application code.
- Claude is used only for language-heavy instructions, not for repeatable calculations.
- Outputs can be validated, regenerated from fresh context, and exported without relying on long chat history.
- Nontechnical catering staff get a clean interface instead of a prompt window.

## Demo features

- Editable guest count and safety buffer
- Menu item selection
- Automatic ingredient scaling
- Prep-list CSV export
- Assembly instructions
- Production timeline
- Warning queue
- System-health indicators
- Responsive desktop and mobile layout

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production architecture represented by the demo

```text
Google Sheets / JSON / Markdown
            ↓
Normalized event and recipe data
            ↓
Deterministic calculation and validation layer
            ↓
Fresh, bounded Claude request
            ↓
Schema-validated prep and assembly package
            ↓
Google Docs / Sheets export and staff-facing UI
```

## Next production steps

1. Add Google OAuth and Sheets API synchronization.
2. Add a Python calculation service for recipe conversion and capacity checks.
3. Add Anthropic API calls with strict JSON-schema validation.
4. Store event runs, approvals, and output versions.
5. Add role-based access for planners, kitchen leads, and pack-out staff.
6. Add automated tests for scaling, allergens, temperatures, and missing source data.

## Deployment

The repository is configured for Next.js and Netlify. Connect the repository to Netlify and deploy the feature branch for a client-facing preview.
