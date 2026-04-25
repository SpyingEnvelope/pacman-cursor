import { Tile } from './constants'

export type Position = {
  row: number
  col: number
}

type ParsedBoard = {
  tiles: Tile[][]
  pacmanStart: Position
  ghostStart: Position
  pellets: number
}

/**
 * The static template for the game board.
 * Each string represents a row on the board.
 * Symbols:
 *   '#' - Wall
 *   '.' - Pellet
 *   'P' - Pac-Man's starting position
 *   'G' - Ghost's starting position
 *   ' ' (space) or any other char - Empty space
 */
const BOARD_TEMPLATE = [
  '###############',
  '#.............#',
  '#.###.###.###.#',
  '#.#.........#.#',
  '#.#.###.###.#.#',
  '#.....#.#.....#',
  '###.#.#.#.#.###',
  '#...#..P..#...#',
  '#.###.###.###.#',
  '#.#.........#.#',
  '#.#.###.###.#.#',
  '#.....#.#.....#',
  '#.###.###.###.#',
  '#...........G.#',
  '###############',
]

/**
 * Parses the BOARD_TEMPLATE to generate internal board data.
 *
 * @returns {ParsedBoard} An object containing:
 *   - tiles: 2D array of Tile values representing the board.
 *   - pacmanStart: Coordinates of Pac-Man's initial position.
 *   - ghostStart: Coordinates of the ghost's initial position.
 *   - pellets: Total count of pellets on the board.
 *
 * The function scans each cell in the template:
 *   '#' becomes Tile.Wall
 *   'P' marks Pac-Man's start (placed as Tile.Empty)
 *   'G' marks Ghost's start (placed as Tile.Empty)
 *   '.' increments pellet count (placed as Tile.Pellet)
 *   All other cells become Tile.Empty.
 */
const parseBoard = (): ParsedBoard => {
  let pacmanStart: Position = { row: 7, col: 7 }
  let ghostStart: Position = { row: 13, col: 11 }
  let pellets = 0

  const tiles = BOARD_TEMPLATE.map((line, rowIndex) =>
    line.split('').map((cell, colIndex) => {
      if (cell === '#') {
        return Tile.Wall
      }
      if (cell === 'P') {
        pacmanStart = { row: rowIndex, col: colIndex }
        return Tile.Empty
      }
      if (cell === 'G') {
        ghostStart = { row: rowIndex, col: colIndex }
        return Tile.Empty
      }
      if (cell === '.') {
        pellets += 1
        return Tile.Pellet
      }
      return Tile.Empty
    }),
  )

  return { tiles, pacmanStart, ghostStart, pellets }
}

const parsedBoard = parseBoard()

export const initialBoard = parsedBoard.tiles
export const initialPacmanPosition = parsedBoard.pacmanStart
export const initialGhostPosition = parsedBoard.ghostStart
export const initialPelletCount = parsedBoard.pellets

/**
 * Creates a mutable deep copy of the initial board tile matrix.
 *
 * @returns A cloned board that can be safely mutated during gameplay.
 */
export const createBoardSnapshot = () => initialBoard.map((row) => [...row])
