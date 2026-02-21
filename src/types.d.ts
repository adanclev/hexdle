import type { GAME_STATUSES, DIGITS, RGB_COLORS } from "@/constants";
import type {Color, HexData} from "@/features/game/types";

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

export interface GameStateCtx {
    id?: number,
    boardState: string[],
    status: GameStatus | null,
    hardMode: boolean,
    darkMode: boolean,
    gameNumber: number | null,
    lastPlayed?: string, // Date
}

export interface GameStats {
  gamesPlayed: number,
  gamesWon: number,
  currentStreak: number,
  maxStreak: number,
  guesses: GuessHistogram,
  currentRow: number | null,
    lastPlayedGameNumber: number | null,
}

export interface Message {
    type: string,
    text: string,
    code?: string
}

export interface GameContextProps {
    gameStateCtx: GameStateCtx,
    gameStats: GameStats,
    message: Message | null,
    gameLoading: boolean,
    toggleTheme: () => void,
    toggleDifficult: () => void,
    updateMessage: (msg: Message | null) => void,
    updateGameState: (guesses: HexData[], status: GameStatus, answer: Color) => void,
    updateGameStats: (newStats: GameStats) => void
}

export interface Rule { // Game Instructions
    id: number,
    text: string
}

export interface Example { // Game Instructions
    id: number,
    hex: string,
    characters: HexDigit[],
    character: string,
    description: string
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