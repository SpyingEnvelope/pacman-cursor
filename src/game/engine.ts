import {
  DIRECTION_DELTAS,
  PELLET_POINTS,
  Tile,
} from './constants'
import {
  createBoardSnapshot,
  initialGhostPosition,
  initialPacmanPosition,
  initialPelletCount,
} from './board'
import type { Direction } from './constants'
import type { Position } from './board'

/**
 * Represents the possible states of the game.
 * - 'playing' : The game is ongoing
 * - 'won'     : The player has collected all pellets
 * - 'lost'    : The player has collided with the ghost
 */
export type GamePhase = 'playing' | 'won' | 'lost'

/**
 * Represents the complete state of the game at any point in time.
 * @property board             The current board layout with all tiles
 * @property pacman            Pac-Man's current position
 * @property pacmanDirection   Pac-Man's current moving direction
 * @property desiredDirection  Pac-Man's intended input direction
 * @property ghost             Ghost's current position
 * @property ghostDirection    Ghost's current moving direction
 * @property pelletsRemaining  Total number of pellets left on the board
 * @property score             The player's score
 * @property phase             The current phase/state of the game
 */
export type GameState = {
  board: Tile[][]
  pacman: Position
  pacmanDirection: Direction
  desiredDirection: Direction
  ghost: Position
  ghostDirection: Direction
  pelletsRemaining: number
  score: number
  phase: GamePhase
}

/**
 * All possible movement directions.
 */
const allDirections: Direction[] = ['up', 'down', 'left', 'right']

/**
 * Checks if a given position is walkable (not a wall and within board boundaries).
 * 
 * @param board     The game board, as a 2D array of Tiles.
 * @param position  The position to check.
 * @returns true if the tile at the given position is not a wall and is in bounds.
 */
const isWalkable = (board: Tile[][], position: Position): boolean => {
  if (position.row < 0 || position.row >= board.length) {
    return false
  }
  if (position.col < 0 || position.col >= board[0].length) {
    return false
  }
  return board[position.row][position.col] !== Tile.Wall
}

/**
 * Returns the next position after moving one step in a given direction.
 * 
 * @param position    The current position.
 * @param direction   The direction to move in.
 * @returns The new position after applying the movement.
 */
const move = (position: Position, direction: Direction): Position => {
  const delta = DIRECTION_DELTAS[direction]
  return {
    row: position.row + delta.row,
    col: position.col + delta.col,
  }
}

/**
 * Determines the ghost's next direction.
 * The ghost typically moves toward Pac-Man, but occasionally moves randomly.
 * The direction must be a walkable direction.
 * 
 * @param state     The current game state.
 * @returns The ghost's next movement direction.
 */
const chooseGhostDirection = (state: GameState): Direction => {
  // List of walkable directions for the ghost from its current position
  const candidates = allDirections.filter((direction) =>
    isWalkable(state.board, move(state.ghost, direction)),
  )

  // If no moves are available, continue in the current direction.
  if (candidates.length === 0) {
    return state.ghostDirection
  }

  // Sort available directions by how close they bring the ghost to Pac-Man.
  const sortedByDistance = [...candidates].sort((first, second) => {
    const nextFirst = move(state.ghost, first)
    const nextSecond = move(state.ghost, second)
    const firstDistance =
      Math.abs(nextFirst.row - state.pacman.row) +
      Math.abs(nextFirst.col - state.pacman.col)
    const secondDistance =
      Math.abs(nextSecond.row - state.pacman.row) +
      Math.abs(nextSecond.col - state.pacman.col)
    return firstDistance - secondDistance
  })

  // 75% of the time, the ghost will move optimally towards Pac-Man.
  if (Math.random() < 0.75) {
    return sortedByDistance[0]
  }
  // Otherwise, pick any available move at random.
  return candidates[Math.floor(Math.random() * candidates.length)]
}

/**
 * Creates and returns a new initial game state.
 * This is used when the game starts or restarts.
 * 
 * @returns {GameState} The initial state of the game.
 */
export const createInitialGameState = (): GameState => ({
  board: createBoardSnapshot(),
  pacman: { ...initialPacmanPosition },
  pacmanDirection: 'left',
  desiredDirection: 'left',
  ghost: { ...initialGhostPosition },
  ghostDirection: 'left',
  pelletsRemaining: initialPelletCount,
  score: 0,
  phase: 'playing',
})

/**
 * Queues the player's intended direction for Pac-Man to move.
 * If the direction is valid in the next tick, Pac-Man will change direction.
 * 
 * @param state       The current game state
 * @param direction   The desired direction to queue for Pac-Man
 * @returns {GameState} The updated game state with queued direction
 */
export const queueDirection = (state: GameState, direction: Direction): GameState => ({
  ...state,
  desiredDirection: direction,
})

/**
 * Advances the game state by one tick:
 * - Handles Pac-Man and ghost movement logic
 * - Updates the board when pellets are eaten
 * - Handles win/loss states (collisions, all pellets eaten)
 * 
 * @param previousState The state of the game before this tick
 * @returns The updated game state after this tick
 */
export const tick = (previousState: GameState): GameState => {
  // If the game is not in a "playing" phase, do nothing.
  if (previousState.phase !== 'playing') {
    return previousState
  }

  // Create shallow copies to avoid mutating prior state.
  const state: GameState = {
    ...previousState,
    board: previousState.board.map((row) => [...row]),
    pacman: { ...previousState.pacman },
    ghost: { ...previousState.ghost },
  }

  // Try to turn Pac-Man in the desired direction, if that tile is walkable.
  const nextDesired = move(state.pacman, state.desiredDirection)
  if (isWalkable(state.board, nextDesired)) {
    state.pacmanDirection = state.desiredDirection
  }

  // Move Pac-Man in the current (possibly updated) direction if walkable.
  const nextPacman = move(state.pacman, state.pacmanDirection)
  if (isWalkable(state.board, nextPacman)) {
    state.pacman = nextPacman
  }

  // Check for and handle pellet eating.
  if (state.board[state.pacman.row][state.pacman.col] === Tile.Pellet) {
    state.board[state.pacman.row][state.pacman.col] = Tile.Empty
    state.score += PELLET_POINTS
    state.pelletsRemaining -= 1
  }

  // Check for collision with the ghost: if so, the player loses.
  if (
    state.pacman.row === state.ghost.row &&
    state.pacman.col === state.ghost.col
  ) {
    return { ...state, phase: 'lost' }
  }

  // Move the ghost.
  state.ghostDirection = chooseGhostDirection(state)
  const nextGhost = move(state.ghost, state.ghostDirection)
  if (isWalkable(state.board, nextGhost)) {
    state.ghost = nextGhost
  }

  // Check again for collision with the ghost (after ghost moves).
  if (
    state.pacman.row === state.ghost.row &&
    state.pacman.col === state.ghost.col
  ) {
    return { ...state, phase: 'lost' }
  }

  // Check for win condition: all pellets eaten.
  if (state.pelletsRemaining <= 0) {
    return { ...state, phase: 'won' }
  }

  // If none of the above, continue playing.
  return state
}
