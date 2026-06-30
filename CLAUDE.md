# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Scrabble-Scorekeeper** is a mobile-friendly scorekeeper for the board game Scrabble. It supports multiple simultaneous games, per-round score entry via an on-screen numpad, live standings with a leader crown, and JSON export/import for backing up or transferring data between devices.

The entire application — markup, styles, and logic — lives in a **single file**: `index.html`. There is no build step, no package manager, and no external dependencies (not even a CDN script). Everything runs as plain vanilla JS in an IIFE.

## Files

- `index.html` — the whole app: HTML shell, a `<style>` block with all CSS, and a `<script>` block with all JS.
- `README.md` — currently just the project title; no extra docs live there.

There is no `app.js` or `style.css` — don't create them as separate files; new styles/markup/logic belong inline in `index.html` in their respective `<style>`/`<script>` blocks, consistent with the rest of the file.

## Running the App

Open `index.html` directly in a browser, or serve with any static file server:

```
npx serve .
# or
python3 -m http.server 8080
```

There is no install, build, lint, or test command — this repo has no `package.json`. Verify changes by opening the page in a browser and exercising the UI (and check `localStorage` in devtools if debugging persistence).

## Code Structure (inside `index.html`)

The script is one big IIFE (`(function(){ "use strict"; ... })()`) with these sections, in order:

1. **Constants** — `KEY` (localStorage key), `LETTER_VALUES` (Scrabble tile point values, used only for the decorative tile rendering, not for scoring), `VERSION` (shown as a badge in the UI — bump it when shipping a notable change), `COLORS` (per-player avatar/accent colors, cycled by index).
2. **Icons** — `ICONS` is a map of inline SVG path data; `ic(name, size, opts)` renders an `<svg>` string for a given icon name. Add new icons here rather than inlining raw SVG in view functions.
3. **Helpers** — `uid()`, `esc()` (HTML-escaping, used on all user-entered strings), `fmtDate()`.
4. **Derivations** — pure functions computed from a game object: `totalsOf(g)`, `nextTurn(g)`, `standings(g)`, `leaderInfo(g)`, plus `buildExport(games)` / `mergeGames(current, incoming)` for backup/restore. These never mutate state.
5. **Tiles** — `tile(ch, size)` and `avatar(name, color, size)` build the Scrabble-tile-styled letter chips used throughout the UI.
6. **State** — a single global `state` object (`games`, `view`, `setup`, `renaming`, `modal`, `backup`, `importErr`, `editScore`, `exportText`) plus a few module-level vars (`numInput`, `editNumInput`, `prevPage`, `toastTimer`). `load()`/`save()` (de)serialize `state.games` to/from `localStorage`.
7. **Numpad logic** — two near-identical numpad implementations: `npDigit/npDel/npSign` for the in-game score entry, and `editNpDigit/editNpDel/editNpSign` for the edit-score modal. They're kept separate (not shared) because they target different DOM elements and state vars — match that pattern if adding a third numpad rather than trying to unify them.
8. **Views** — pure string-building functions that return HTML: `viewHome`, `viewSetup`, `viewGame`, plus `renderModals()` for overlays (confirm dialogs, export/import, edit-score). `render()` picks a view by `state.view.name`, sets `app.innerHTML`, and re-focuses inputs as needed.
9. **Handlers** — functions that mutate `state`/`numInput`/etc. and then call `save()` and/or `render()`.
10. **Event wiring** — a single delegated `click` listener on `#app` that reads `data-action` (and related `data-*`) attributes via `e.target.closest('[data-action]')` and dispatches through a `switch`, plus a `keydown` listener for numpad/Enter/Escape shortcuts.

## Conventions

- **Rendering model**: this is a full re-render-on-every-change architecture (`render()` rebuilds `app.innerHTML` from `state`), *not* a virtual DOM. There's no diffing — keep this in mind for perf-sensitive changes (e.g. avoid triggering renders in tight loops).
- **Event handling**: all interactive elements use a `data-action="..."` attribute plus event delegation on `#app`. Don't attach inline `onclick` handlers or per-element listeners — add a new `case` to the `switch` in the click listener instead, and read any extra params off `data-*` attributes on the element.
- **Styling**: utility-ish custom classes prefixed `sc-` (e.g. `sc-btn`, `sc-card`, `sc-panel`, `sc-chip`) defined once in the `<style>` block; one-off layout tweaks are done with inline `style="..."` in the view functions rather than new CSS classes. Follow whichever the existing surrounding code does.
- **JS style**: ES5-leaning vanilla JS — `var`, `function` expressions, no `class`, no arrow functions, no template literals (strings are built with `+` concatenation). Match this style for consistency; don't introduce a transpile step or modern syntax that would look out of place.
- **Escaping**: any value that came from user input (player names, game names, imported backup text) must be passed through `esc()` before being concatenated into HTML strings.
- **Scoring model**: a game's scores are a single flat array (`g.scores`), not per-player. Turn index `ti` maps to player `ti % players.length` and round `Math.floor(ti / players.length)`. Totals/standings/leader are always *derived* from `g.scores` (see `totalsOf`/`standings`/`leaderInfo`) rather than stored — don't add redundant stored totals.
- **Persistence**: all games live under one localStorage key (`scrabble:data:v1`) as `{v:1, games:[...]}`. Backup/restore round-trips through `buildExport`/`mergeGames`, merging by `id` and keeping whichever copy has the newer `updatedAt`.
- **Mobile-first**: the app targets phones first — `viewport-fit=cover`, `env(safe-area-inset-*)` padding, `apple-mobile-web-app-*` meta tags, and `navigator.vibrate(...)` haptic feedback on numpad/score actions. Preserve these when touching layout or the entry panel.

## Testing

There is no automated test suite. Validate changes manually in a browser: create a game, enter scores for a few rounds (including edits via tapping a filled cell, undo, and a negative score), end the game and confirm the winner/crown/confetti, then export and re-import a backup to confirm merge behavior. Check `localStorage` (`scrabble:data:v1`) in devtools when debugging persistence issues.
