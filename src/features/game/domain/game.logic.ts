import type {GameStateCtx, GameStatus, GuessHistogram} from "@/types";
import type {HexData} from "@/features/game/types";

export function shouldResetGame (
    currentGameNumber: number,
    storedGameNumber: number,
): boolean {
    return storedGameNumber !== currentGameNumber;
}

export function buildNextGameState (
    prev: GameStateCtx,
    guesses: HexData[],
    status: GameStatus,
    todayStr: string,
    gameNumber: number,
): GameStateCtx {
    if (guesses.length === 0) return prev;

    const newGameState: GameStateCtx = {
        ...prev,
        boardState: guesses.map(guess => guess.hex),
        status,
        lastPlayed: todayStr,
        gameNumber,
    }

    return newGameState;
}

export function buildGuessHistogram (
    guessDistribution: number[],
): GuessHistogram {
    const histogram = {
        "1": guessDistribution[0],
        "2": guessDistribution[1],
        "3": guessDistribution[2],
        "4": guessDistribution[3],
        "5": guessDistribution[4],
        "6": guessDistribution[5],
    }

    return histogram;
}