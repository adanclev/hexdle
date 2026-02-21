import { TileRow } from "@/features/game/components/TileRow"
import type { HexData } from "@/features/game/types"
import { initialGuessEmpty, MAX_GUESSES } from "@/features/game/constants"

interface Props {
    guesses: HexData[],
    currentGuess: HexData,
    loading: boolean,
}

export const GameGrid = ({ guesses, currentGuess, loading }: Props) => {
    const rows = [...guesses]
    if (rows.length < MAX_GUESSES) {
        rows.push(currentGuess)
    }

    while (rows.length < MAX_GUESSES) {
        rows.push(initialGuessEmpty)
    }

    return (
        <div className={`flex flex-col items-center justify-center sm:h-fit w-full gap-2 ${loading ? 'animate-pulse' : ''}`}>
            {rows.map((guess, idx) => (
                <TileRow key={idx} tiles={guess.characters} status={guess.status} />
            ))}
        </div>
    )
}
