# Scrabble Scorekeeper

An offline-friendly Scrabble score tracker that runs entirely in the browser —
phone or desktop. Set up players, keep score round by round, fix mistakes, and
crown a winner.

## Play it

- **Locally:** clone or download the repo and open `index.html` in your browser.
- **Live (GitHub Pages):** in **Settings → Pages**, set the source to deploy from
  a branch, pick the branch and `/ (root)` folder, and save. GitHub then serves it
  at `https://<owner>.github.io/Scrabble-Scorekeeper/`.
- **Install on a phone:** open the live URL in Safari or Chrome and choose
  *Add to Home Screen* — it installs with its own Scrabble-tile icon and opens
  full-screen, like a native app.

## Features

- Multiple games, saved automatically in your browser (`localStorage`).
- 2–8 players with custom names and adjustable turn order.
- Round-by-round scoreboard, one column per player, newest round on top; tap any
  score to fix it (enter a negative number for end-of-game tile penalties).
- Running totals with a glowing crown on the current leader, and a winner
  celebration when the game ends.
- Back up / restore every game as portable text to move them between devices.

## How it's built

The whole app is `index.html`: markup, CSS, and vanilla JavaScript — no build
step and no dependencies. Game data is stored locally under the
`scrabble:data:v1` key. Home-screen installation is provided by
`manifest.webmanifest` and the `icon*.png` / `apple-touch-icon.png` / `icon.svg`
assets. To change scoring, layout, or behaviour, edit `index.html`.
