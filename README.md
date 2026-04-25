# Pacman Frontend

A browser-based Pacman-style game built with React and TypeScript.  
This project focuses on a simple, playable arcade experience: enter your name, collect pellets, avoid the ghost, and try to clear the maze.

## What This Project Is

This is a **frontend-only** application (no backend required) designed to feel close to classic Pacman:

- Name entry before the game starts
- Live score tracking
- Arrow-key movement
- Win/lose game states with replay

## Features

- **Player onboarding**: prompts for a player name before starting
- **HUD**: shows player name at the top and score on the top-right
- **Core gameplay loop**:
  - move with arrow keys
  - collect pellets for points
  - avoid the ghost
- **Game states**:
  - win by clearing all pellets
  - lose by colliding with the ghost
  - restart quickly with **Play Again**

## Tech Stack

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **ESLint**

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (current LTS recommended)
- npm (included with Node.js)

### Installation

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

Vite will print a local URL (typically `http://localhost:5173`) to open in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Starts the development server with hot reload
- `npm run build` - Type-checks and builds the production bundle
- `npm run preview` - Serves the built app locally for preview
- `npm run lint` - Runs ESLint across the project

## How to Play

1. Start the app and enter your player name.
2. Use the arrow keys to move Pacman around the maze.
3. Collect pellets to increase your score.
4. Avoid the ghost while clearing the board.
5. If you win or lose, select **Play Again** to restart.

## Project Structure

```text
src/
  App.tsx                 # App shell and game flow (start/play/restart)
  main.tsx                # React entry point
  components/
    StartScreen.tsx       # Name input screen
    GameBoard.tsx         # Board rendering and game loop wiring
  game/
    constants.ts          # Shared game constants and tile/direction types
    board.ts              # Maze layout and initial board state
    engine.ts             # Movement, scoring, collisions, win/loss logic
```
