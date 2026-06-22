# Scrabble Scorekeeper

A single-file, offline-friendly Scrabble score tracker. Open `index.html` in any
browser — phone or desktop — to set up players, keep score round by round, fix
mistakes, and crown a winner.

## Play it

- **Locally:** clone or download the repo and open `index.html` in your browser.
- **Live (GitHub Pages):** in **Settings → Pages**, set the source to deploy from
  a branch, pick the branch and `/ (root)` folder, and save. GitHub then serves it
  at `https://<owner>.github.io/Scrabble-Scorekeeper/`.

## Features

- Multiple games, saved automatically in your browser (`localStorage`).
- 2–8 players with custom names and adjustable turn order.
- Round-by-round score grid; tap any score to fix it (negatives allowed for
  end-of-game tile penalties).
- Live standings with leader highlight, "takes the lead" toasts, and a winner
  celebration.
- Back up / restore every game as portable text to move them between devices.

## How it's built

Everything lives in `index.html`: markup, CSS, and vanilla JavaScript — no build
step and no dependencies. Game data is stored locally under the
`scrabble:data:v1` key. To change scoring, layout, or behaviour, edit that one
file.
