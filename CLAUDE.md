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

- `index.html` — markup and screen layout
- `style.css` — all styles
- `app.js` — game logic, state, numpad handlers
