import { useState } from 'react'
import type { FormEvent } from 'react'

type StartScreenProps = {
  onStart: (name: string) => void
}

/**
 * Renders the pre-game form used to collect the player's name.
 *
 * @param onStart Callback invoked with a validated player name.
 * @returns The start screen UI.
 */
export function StartScreen({ onStart }: StartScreenProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  /**
   * Validates and submits the player name before starting the game.
   *
   * @param event The form submission event.
   * @returns Nothing.
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Please enter a name to start.')
      return
    }

    setError('')
    onStart(trimmed)
  }

  return (
    <section className="grid min-h-screen content-center place-items-center gap-4 px-4 py-8">
      <h1 className="m-0 text-[clamp(2.5rem,8vw,4rem)] uppercase tracking-[0.06em] text-[#ffd000]">
        Pacman
      </h1>
      <p className="m-0 text-[#e9e9e9]">Enter your name and clear every pellet.</p>
      <form
        className="grid w-[min(90vw,360px)] gap-2.5 rounded-[10px] border-2 border-[#0a36d6] bg-[#0b0b16] p-4"
        onSubmit={handleSubmit}
      >
        <label htmlFor="playerNameInput" className="text-[0.9rem] font-bold">
          Player name
        </label>
        <input
          id="playerNameInput"
          className="rounded-md border border-[#4f67f5] bg-black px-3 py-2.5 text-base text-[#fefefe] outline-none focus:outline-2 focus:outline-[#ffd000] focus:outline-offset-1"
          maxLength={20}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Pac-Player"
          autoFocus
        />
        {error ? <p className="m-0 text-[0.9rem] text-[#ff7f7f]">{error}</p> : null}
        <button
          type="submit"
          className="cursor-pointer rounded-md bg-[#ffd000] px-4 py-3 text-[0.95rem] font-extrabold text-[#171717] transition hover:brightness-105"
        >
          Start Game
        </button>
      </form>
    </section>
  )
}
