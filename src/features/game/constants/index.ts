import type { HexData } from "@/features/game/types";
import { DIGITS, RGB_COLORS } from "@/constants.ts";

export const colorClasses = {
    red: {
        match: 'red-match',
        high: 'red-high',
        low: 'red-low'
    },
    green: {
        match: 'green-match',
        high: 'green-high',
        low: 'green-low'
    },
    blue: {
        match: 'blue-match',
        high: 'blue-high',
        low: 'blue-low'
    }
}

export const KEYS_ALLOWED = [...DIGITS, 'enter', 'del'] as const;

export const STATUSES = {
    CHARS: {
        MATCH: 'match',
        HIGH: 'high',
        LOW: 'low'
    },
    GUESS: {
        ERROR: 'error',
        NORMAL: 'normal',
        CORRECT: 'correct'
    }
}

export const MSG_TYPE = {
    ERROR: 'error',
    INFO: 'info',
    SUCCESS: 'success'
}

export const MSG_CODE = {
    NOT_ENOUGH_DIGITS: 'not-enough-digits',
    GAME_OVER: 'game-over',
    WIN: 'win',
    INVALID_INPUT: 'invalid-input',
    HARD_MODE: 'hard-mode'
}

export const initialGuess: HexData = {
    hex: '', characters: [
        { character: null, color: RGB_COLORS.RED },
        { character: null, color: RGB_COLORS.RED },
        { character: null, color: RGB_COLORS.GREEN },
        { character: null, color: RGB_COLORS.GREEN },
        { character: null, color: RGB_COLORS.BLUE },
        { character: null, color: RGB_COLORS.BLUE }
    ]
}

export const initialGuessEmpty: HexData = {
    hex: '',
    characters: Array.from({ length: 6 }, () => ({
        character: null
    }))
}

export const MAX_GUESSES = 6
export const MAX_DIGITS = 6
export const defaultTileDelay = 250