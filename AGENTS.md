# AGENTS.md

Expo SDK 57 app for a mobile programming course, built by a group of 3 students. Current stage: Modul 1 (syntax & basic UI).

Before writing code, read `TUGAS.md` (who builds what, shared data shapes, component props), `ATURAN.md` (file names, comment format, Git workflow) and `STANDAR.md` (exact UI and functions copied from the old Nakesa app). Follow them exactly.

- One page per person. Only edit the files of the page you were asked to work on. In shared files (`index.ts` in each folder, `functions/format.ts`) only add lines.
- Modul 1 limits: data is static in `constants/`. Do not use `useState` or other hooks, `router` or `Link`, `fetch`, a database, or new packages. Buttons show an `Alert`.
- Use only the colors, sizes, texts, icons and function names in `STANDAR.md`. Do not invent new ones.
- Screens live in `app/`. Other code lives in `components/`, `constants/`, `functions/`, `styles/` and `types/`, imported with `@/`.
- Comment style: a TABLE OF CONTENT header, numbered section comments, and `[n]` markers explained in an EXPLANATION block at the bottom, in Indonesian, like `components/PraktikCard.tsx`. Use 4-space indents and double quotes.
- The student must explain every line at the demo without AI. Prefer simple, explicit code at the level of the course module.
- Expo changes every SDK. Read https://docs.expo.dev/versions/v57.0.0/ before using an Expo API.
- Run `npx expo lint` and `npx tsc --noEmit` before calling a task done.
- No AI attribution in commits (no `Co-Authored-By`, no "Generated with"). Do not push unless the user asks.
- Reply to the user in Indonesian.
