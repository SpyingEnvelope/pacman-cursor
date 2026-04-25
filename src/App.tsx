import { useState } from 'react'
import { GameBoard } from './components/GameBoard'
import { StartScreen } from './components/StartScreen'

type AppPhase = 'ready' | 'playing' | 'won' | 'lost'

/**
 * Renders the main application shell and coordinates start, gameplay, and restart flow.
 *
 * @returns The Pacman application UI.
 */
function App() {
  const [playerName, setPlayerName] = useState('')
  const [score, setScore] = useState(0)
  const [phase, setPhase] = useState<AppPhase>('ready')
  const [sessionId, setSessionId] = useState(0)

  /**
   * Initializes a new game session for the provided player name.
   *
   * @param name The player name entered on the start screen.
   * @returns Nothing.
   */
  const startGame = (name: string) => {
    setPlayerName(name)
    setScore(0)
    setPhase('playing')
    setSessionId((value) => value + 1)
  }

  /**
   * Restarts the current game session while keeping the active player name.
   *
   * @returns Nothing.
   */
  const restartGame = () => {
    setScore(0)
    setPhase('playing')
    setSessionId((value) => value + 1)
  }

  const isPlaying = phase === 'playing' || phase === 'won' || phase === 'lost'

  return (
    <main className="min-h-screen bg-black font-['Trebuchet_MS','Arial',sans-serif] text-[#f7f1d1]">
      {playerName ? (
        <header className="flex items-center justify-between border-b-2 border-[#0a36d6] bg-[#02020a] px-5 py-3 text-base font-bold tracking-[0.04em] max-[700px]:text-sm">
          <p>Player: {playerName}</p>
          <p className="text-[#fff47a]">Score: {score}</p>
        </header>
      ) : null}

      {!playerName ? (
        <StartScreen onStart={startGame} />
      ) : (
        <section className="relative grid min-h-[calc(100vh-61px)] place-items-center p-4">
          {isPlaying ? (
            <GameBoard
              key={sessionId}
              onScoreChange={setScore}
              onPhaseChange={setPhase}
            />
          ) : null}

          {phase !== 'playing' ? (
            <div className="absolute inset-0 grid content-center justify-items-center gap-3 bg-black/70">
              <p className="m-0 text-2xl font-extrabold text-white">
                {phase === 'won' ? 'You cleared the maze!' : 'Game over!'}
              </p>
              <button
                type="button"
                className="cursor-pointer rounded-md bg-[#ffd000] px-4 py-3 text-[0.95rem] font-extrabold text-[#171717] transition hover:brightness-105"
                onClick={restartGame}
              >
                Play Again
              </button>
            </div>
          ) : null}
        </section>
      )}
    </main>
  )
}

export default App
