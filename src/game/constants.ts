export const CELL_SIZE = 28
export const GAME_TICK_MS = 180
export const PELLET_POINTS = 10

export const Tile = {
  Empty: 0,
  Wall: 1,
  Pellet: 2,
} as const

export type Tile = (typeof Tile)[keyof typeof Tile]

export type Direction = 'up' | 'down' | 'left' | 'right'

export const DIRECTION_DELTAS: Record<Direction, { row: number; col: number }> = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
}
