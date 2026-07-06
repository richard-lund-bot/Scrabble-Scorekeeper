# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Scrabble-Scorekeeper** is a scorekeeper application for the board game Scrabble. Built as a plain HTML/CSS/JS app — no build step, no dependencies.

## Running the App

Open `index.html` directly in a browser, or serve with any static file server:

```
npx serve .
# or
python3 -m http.server 8080
```

## Files

The whole app ships as a single self-contained `index.html` (no external CSS/JS), so it works offline and on GitHub Pages. Inside it:

- `<head><style>` — the full design system (CSS custom properties in `:root`, then components)
- Two data `<script>` blocks — `window.SCRABBLE_ORDBOK` (494 902-word Norwegian bokmål list, front-coded) and `window.SCRABBLE_SYNVEV` (synonym/category graph, base36). These are large (~3.4 MB); leave them untouched when editing UI.
- The final `<script>` — the whole app: state, views, word engine, numpad, storage, event wiring. Everything renders into `<div id="app">`.

The UI is in Norwegian throughout. Features are packaged as: the **Scorekeeper** (games list → setup → live scoring) and one unified **Ordbok** tool with three tabs — *Finn ord* (rack helper), *Kryssord* (clue/pattern solver), *Slå opp* (validity + external lookups) — reachable from home and mid-game.
