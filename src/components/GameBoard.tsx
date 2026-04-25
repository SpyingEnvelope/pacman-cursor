import { useEffect, useMemo, useState } from 'react'
import { Tile, CELL_SIZE, GAME_TICK_MS } from '../game/constants'
import { createInitialGameState, queueDirection, tick } from '../game/engine'
import type { Direction } from '../game/constants'
import type { GamePhase } from '../game/engine'

type GameBoardProps = {
  onScoreChange: (score: number) => void
  onPhaseChange: (phase: GamePhase) => void
}

const keyToDirection: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
}

/**
 * Renders the game board and advances gameplay state on input and timer ticks.
 *
 * @param onScoreChange Callback used to publish score updates to parent state.
 * @param onPhaseChange Callback used to publish game phase updates to parent state.
 * @returns The interactive board UI.
 */
export function GameBoard({ onScoreChange, onPhaseChange }: GameBoardProps) {
  const [gameState, setGameState] = useState(() => createInitialGameState())

  useEffect(() => {
    onScoreChange(gameState.score)
  }, [gameState.score, onScoreChange])

  useEffect(() => {
    onPhaseChange(gameState.phase)
  }, [gameState.phase, onPhaseChange])

  useEffect(() => {
    /**
     * Handles arrow-key input and queues Pac-Man's next desired direction.
     *
     * @param event The keyboard event raised by the window.
     * @returns Nothing.
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = keyToDirection[event.key]
      if (!direction) {
        return
      }
      event.preventDefault()
      setGameState((state) => queueDirection(state, direction))
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setGameState((state) => tick(state))
    }, GAME_TICK_MS)

    return () => window.clearInterval(intervalId)
  }, [])

  const boardStyle = useMemo(
    () => ({
      gridTemplateColumns: `repeat(${gameState.board[0].length}, ${CELL_SIZE}px)`,
      gridTemplateRows: `repeat(${gameState.board.length}, ${CELL_SIZE}px)`,
    }),
    [gameState.board],
  )

  return (
    <div className="grid justify-items-center gap-3">
      <div
        className="grid border-[3px] border-[#0a36d6] bg-[#03030c] shadow-[0_0_20px_rgba(44,91,255,0.35)]"
        style={boardStyle}
        aria-label="Pacman game board"
      >
        {gameState.board.flatMap((row, rowIndex) =>
          row.map((tile, colIndex) => {
            const isPacman =
              gameState.pacman.row === rowIndex && gameState.pacman.col === colIndex
            const isGhost =
              gameState.ghost.row === rowIndex && gameState.ghost.col === colIndex

            const classes = [
              'relative h-7 w-7',
              tile === Tile.Wall ? 'bg-[#1237e0]' : 'bg-black',
            ]

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={classes.join(' ')}
                role="presentation"
              >
                {tile === Tile.Pellet ? (
                  <span className="absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5f5f5]" />
                ) : null}
                {isPacman ? (
                  <span className="absolute inset-[3px] rounded-full bg-[#ffd000]" />
                ) : null}
                {isGhost ? (
                  <span className="absolute inset-1 rounded-[40%_40%_25%_25%] bg-[#ff4d6b]" />
                ) : null}
              </div>
            )
          }),
        )}
      </div>
      <p className="m-0 text-[0.9rem] text-[#b8b8b8]">Use arrow keys to move.</p>
    </div>
  )
}
