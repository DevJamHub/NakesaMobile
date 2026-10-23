# AGENTS.md

Expo SDK 57 app for a mobile programming course, built by a group of 3 students. Current stage: Modul 2 (state, hooks & page navigation). Everything built in Modul 1 must keep working.

Before writing code, read `TUGAS.md` (who builds what, shared data shapes, component props), `ATURAN.md` (file names, comment format, Git workflow) and `STANDAR.md` (exact UI and functions copied from the old Nakesa app). Follow them exactly.

- One page per person. Only edit the files of the page you were asked to work on. In each folder's `index.ts`, add lines only under your own name section (`// ===== Sigit =====`, `// ===== Bayhaqy =====`, `// ===== Aditya =====`). Register a new tab page as `<Tabs.Screen>` in `app/(tabs)/_layout.tsx`, and any other page as `<Stack.Screen>` in `app/_layout.tsx`, under your own name section in both files.
- Never commit a file that still contains Git conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`). Before pushing, run `git pull origin main`, resolve any conflicts, and make sure `npx tsc --noEmit` passes.
- Modul 2 limits: data is still static in `constants/`. Use `useState`, `useEffect`, `router` (`push`, `back`, `canGoBack`, `replace`) and `useLocalSearchParams` as `TUGAS.md` assigns them, importing `Stack` and `router` from `expo-router` and `Tabs` from `expo-router/js-tabs`. Do not use `fetch`, a database, or new packages. Pop-ups use `tampilkanPesan` from `@/functions` so they also work on web.
- Use only the colors, sizes, texts, icons and function names in `STANDAR.md`. Do not invent new ones.
- Screens live in `app/`. Other code lives in `components/`, `constants/`, `functions/`, `styles/` and `types/`, imported with `@/`.
- Comment style: a TABLE OF CONTENT header, numbered section comments, and `[n]` markers explained in an EXPLANATION block at the bottom, in Indonesian, like `components/PraktikCard.tsx`. Use 4-space indents and double quotes.
- The student must explain every line at the demo without AI. Prefer simple, explicit code at the level of the course module.
- Expo changes every SDK. Read https://docs.expo.dev/versions/v57.0.0/ before using an Expo API.
- Run `npx expo lint` and `npx tsc --noEmit` before calling a task done.
- No AI attribution in commits (no `Co-Authored-By`, no "Generated with"). Do not push unless the user asks.
- Reply to the user in Indonesian.
