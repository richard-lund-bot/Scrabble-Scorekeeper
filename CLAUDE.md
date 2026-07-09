# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Ordsmed** ("wordsmith") is a Norwegian companion app for all word games — Scrabble, Wordfeud, crosswords, rhymes, anagrams. It bundles a suite of word tools plus a game-agnostic scorekeeper. Built as a plain HTML/CSS/JS app — no build step, no dependencies. (The repo is still named `Scrabble-Scorekeeper`; the localStorage key remains `scrabble:data:v1`.)

## Running the App

Open `index.html` directly in a browser, or serve with any static file server:

```
npx serve .
# or
python3 -m http.server 8080
```

## Files

The whole app ships as a single self-contained `index.html` (no external CSS/JS), so it works offline and on GitHub Pages. Inside it:

- `<head><style>` — the full design system (CSS custom properties in `:root`, then components). Theming is variable-driven: a light palette overrides the `:root` vars under `@media (prefers-color-scheme: light)` (system) and `:root[data-theme="light"]` (manual). A theme toggle cycles system → light → dark, stored in `localStorage` (`ordsmed:theme`) and applied as `data-theme` on `<html>`. Keep new colors as `var(--…)` so both themes work.
- Two data `<script>` blocks — `window.SCRABBLE_ORDBOK` (494 902-word Norwegian bokmål list, front-coded) and `window.SCRABBLE_SYNVEV` (synonym/category graph, base36). These are large (~3.4 MB); leave them untouched when editing UI.
- The final `<script>` — the whole app: state, views, word engine, rhyme engine, on-screen keyboard, numpad, storage, event wiring. Everything renders into `<div id="app">`.

The UI is in Norwegian throughout. The home screen leads with **Ordverktøy** (word tools); the scorekeeper sits below as one section.

**Word tools** (tabs, reachable from home and mid-game): *Finn ord* (rack/anagram helper), *Kryssord* (synonym + a box grid: pick letter count, tap boxes, fill known letters — no pattern typing), *Rim* (suffix-based rhyme finder over the word list), *Slå opp* (validity + NAOB/Ordbøkene/Synonym links). All tool text input goes through a custom on-screen **Norwegian QWERTY keyboard** (`keyboard()` / `kbKey`/`kbBack`/`kbGo`) — no native keyboard; fields render as tiles with a caret.

**Scorekeeper**: games list → setup → live scoring with a 3×4 numpad, round grid, hidden-scores mode, backup/restore.
