import type { Digit } from "@/types";

type StrengthBarDigits = Record<Digit, string>;
export const STRENGTH_BAR_DIGITS: StrengthBarDigits = {
    "0": "red-low",
    "1": "red-low",
    "2": "red-match",
    "3": "red-match",
    "4": "red-high",
    "5": "red-high",
    "6": "green-low",
    "7": "green-low",
    "8": "green-match",
    "9": "green-match",
    "a": "green-high",
    "b": "blue-low",
    "c": "blue-low",
    "d": "blue-match",
    "e": "blue-match",
    "f": "blue-high",
} as const

const WEIGHT = {
    ENTROPY: 0.5,
    LENGTH: 0.3,
    COMPLEX: 0.2,
} as const

function calculateEntropy(flags: number, l: number): number {
    const n =
        ((flags & 1) ? 26 : 0) +
        ((flags & 2) ? 26 : 0) +
        ((flags & 4) ? 10 : 0) +
        ((flags & 8) ? 32 : 0);
    const entropy = l * Math.log2(n)

    return Math.min(entropy / 128, 1) * 4
}

export function passwordStrength(value: string): number {
    const n = value.length;
    const flags =
        (/[a-z]/.test(value) ? 1 : 0) | // lower - 0001
        (/[A-Z]/.test(value) ? 2 : 0) | // upper - 0010
        (/[0-9]/.test(value) ? 4 : 0) | // digit - 0100
        (/[^A-Za-z0-9]/.test(value) ? 8 : 0) // symbol - 1000

    const entropy = calculateEntropy(flags, n)
    const length = n < 8 ? 0 : n < 12 ? 2 : 4
    const complex =
        ((flags & 1) ? 1 : 0) +
        ((flags & 2) ? 1 : 0) +
        ((flags & 4) ? 1 : 0) +
        ((flags & 8) ? 1 : 0);
    const weightedAvg = (entropy * WEIGHT.ENTROPY) + (length * WEIGHT.LENGTH) + (complex * WEIGHT.COMPLEX)
    const score = Math.round(weightedAvg * 4) // max 16
    const repetitionPenalty =
        /(.)\1{2,}/.test(value) ? -1 : 0

    return score + repetitionPenalty
}
