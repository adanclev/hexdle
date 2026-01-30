import type { GAME_STATUSES, DIGITS, RGB_COLORS } from "@/constants";

export type GameStatus = typeof GAME_STATUSES[keyof typeof GAME_STATUSES]
export type Digit = typeof DIGITS[number]
export type RgbColor = typeof RGB_COLORS[keyof typeof RGB_COLORS]

export type GuessHistogram = {
  "1": number,
  "2": number,
  "3": number,
  "4": number,
  "5": number,
  "6": number,
}

export interface StoredGameState {
    boardState: string[],
    status: GameStatus | null,
    hardMode: boolean,
    darkMode: boolean,
    lastPlayed?: string, // Date
}

export interface GameStats {
  gamesPlayed: number,
  gamesWon: number,
  currentStreak: number,
  maxStreak: number,
  guesses: GuessHistogram,
  currentRow: number | null
}

export interface Rule { // Game Instructions
    id: number,
    text: string
}

export interface Example { // Game Instrucctions
    id: number,
    hex: string,
    characters: HexDigit[],
    character: string,
    description: string
}

export interface Message {
    type: string,
    text: string,
    code?: string
}

export type ViewSignIn = 'sign_in'
export type ViewSignUp = 'sign_up'
export type ViewMagicLink = 'magic_link'
export type ViewForgottenPassword = 'forgotten_password'
export type ViewUpdatePassword = 'update_password'

export type ViewType =
    | ViewSignIn
    | ViewSignUp
    | ViewMagicLink
    | ViewForgottenPassword
    | ViewUpdatePassword

export interface ViewsMap {
    [key: string]: ViewType
}