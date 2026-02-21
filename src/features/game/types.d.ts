import { KEYS_ALLOWED } from "@/features/game/constants";
import type { Digit, RgbColor } from "@/types"

export type AllowedKey = typeof KEYS_ALLOWED[number];

interface HexData {
  hex: string,
  characters: HexDigit[],
  status?: string
}

interface HexDigit {
    character: Digit | null,
    color?: RgbColor,
    status?: 'match' | 'high' | 'low',
}

export interface Color extends HexData {
    name: string
}

export interface GameState {
    answer: Color,
    currentGuess: HexData,
    guesses: HexData[],
    isGameOver: boolean,
    isCorrect: boolean,
    remainingGuesses: number,
}
