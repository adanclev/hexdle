import type { GameState, Color, HexData, HexDigit, AllowedKey } from '@/features/game/types'
import { useContext, useEffect, useState } from 'react'
import { initialGuess, MAX_DIGITS, STATUSES, MAX_GUESSES, MSG_TYPE, MSG_CODE } from '@/features/game/constants'
import { DIGITS } from "@/constants";
import { GameContext } from '@/context/GameObjectContext'
import { GAME_STATUSES } from '@/constants'
import type {Digit, GameStats} from '@/types'

const initialState = (answer: Color): GameState => ({
    answer,
    currentGuess: initialGuess,
    guesses: [],
    isGameOver: false,
    isCorrect: false,
    remainingGuesses: 6,
})

export const useGame = (answer: Color) => {
    const [gameState, setGameState] = useState<GameState>(initialState(answer))
    const [hasGameJustFinished, setHasGameJustFinished] = useState(false);
    const { gameContext, gameStats, updateMessage, updateGameContext, updateGameStats } = useContext(GameContext)

    useEffect(() => {
        const savedGuesses = gameContext.boardState
        if (savedGuesses.length > 0) {
            const { loadedGuesses, isCorrect } = loadState(savedGuesses)
            const remainingGuesses = MAX_GUESSES - savedGuesses.length
            const isGameOver = isCorrect || remainingGuesses === 0

            setGameState(prev => ({
                ...prev,
                guesses: loadedGuesses,
                currentGuess: initialGuess,
                isCorrect,
                isGameOver,
                remainingGuesses

            }))
        }
    }, [])

    function loadState(savedGuesses: string[]) {
        const loadedGuesses: HexData[] = []
        let isCorrect: boolean = false

        for (const guess of savedGuesses) {
            const charsCopy = initialGuess.characters.map(c => ({ ...c }))
            const characters: HexDigit[] = guess.split('').map((char, index) => ({
                ...charsCopy[index],
                character: char as Digit
            }));

            const newGuess: HexData = {
                hex: guess,
                characters
            }

            const result = checkGuess(newGuess)
            isCorrect = result.isCorrect
            loadedGuesses.push(result.lastGuess)
        }

        return { loadedGuesses, isCorrect }
    }

    const hasNoNullCharacters = (
        chars: HexDigit[]
    ): chars is { character: Digit }[] =>
        chars.every(c => c.character !== null);

    function checkGuess(currentGuess: HexData) {
        const { hex: answerHex, characters: answerChars } = gameState.answer
        const { hex: currentHex, characters: currentChars } = currentGuess
        const step = gameContext.hardMode ? 2 : 1

        if (!hasNoNullCharacters(answerChars) || !hasNoNullCharacters(currentChars)) {
            return {
                lastGuess: initialGuess,
                isCorrect: false,
                isInvalid: true,
            }
        }

        const isCorrect = currentHex === answerHex
        const feedback = new Array(6).fill(STATUSES.CHARS.MATCH)

        if (!isCorrect) {
            for (let i = 0; i < currentChars.length; i += step) {
                const idxCurrentChar = DIGITS.indexOf(currentChars[i].character)
                const idxAnswerChar = DIGITS.indexOf(answerChars[i].character)

                if (gameContext.hardMode && i + 1 < currentChars.length) {
                    const idx2CurrentChar = DIGITS.indexOf(currentChars[i + 1].character)
                    const idx2AnswerChar = DIGITS.indexOf(answerChars[i + 1].character)
                    const diff = (idxCurrentChar ** 2 + idx2CurrentChar) - (idxAnswerChar ** 2 + idx2AnswerChar)

                    if (diff === 0) continue

                    const state = diff < 0
                        ? STATUSES.CHARS.LOW
                        : STATUSES.CHARS.HIGH

                    feedback[i] = state
                    feedback[i + 1] = state
                } else {
                    if (idxCurrentChar === idxAnswerChar) continue
                    feedback[i] = idxCurrentChar < idxAnswerChar
                        ? STATUSES.CHARS.LOW
                        : STATUSES.CHARS.HIGH
                }
            }
        }

        const newCurrent = {
            ...currentGuess,
            status: isCorrect ? STATUSES.GUESS.CORRECT : STATUSES.GUESS.NORMAL,
            characters: currentGuess.characters.map((char, i) => ({
                ...char, status: feedback[i]
            }))
        }

        return { lastGuess: newCurrent, isCorrect, isInvalid: false }
    }

    function handleNotEnoughDigits(currentStatus: string) {
        updateMessage(null);
        setTimeout(() => {
            updateMessage({
                type: MSG_TYPE.ERROR,
                text: 'Not enough digits',
                code: MSG_CODE.NOT_ENOUGH_DIGITS
            });
        }, 0);

        if (currentStatus === STATUSES.GUESS.ERROR) return

        setGameState(prev => ({
            ...prev,
            currentGuess: {
                ...prev.currentGuess,
                status: STATUSES.GUESS.ERROR
            }
        }))

        setTimeout(() => {
            setGameState(prev => ({
                ...prev,
                currentGuess: {
                    ...prev.currentGuess,
                    status: STATUSES.GUESS.NORMAL
                }
            }));
        }, 500);
    }

    function handleEnter() {
        const { hex, status } = gameState.currentGuess

        if (hex.length !== MAX_DIGITS) {
            handleNotEnoughDigits(status ?? '')
            return;
        }

        const {
            lastGuess,
            isCorrect,
            isInvalid,
        } = checkGuess(gameState.currentGuess)
        if (isInvalid) {
            handleNotEnoughDigits(STATUSES.GUESS.ERROR ?? '')
            return;
        }
        const remainingGuesses = gameState.remainingGuesses - 1
        const isGameOver = isCorrect || remainingGuesses === 0

        const updateGuesses = [...gameState.guesses, lastGuess]
        const updateStatus = isGameOver
            ? isCorrect ? GAME_STATUSES.WON : GAME_STATUSES.LOST
            : GAME_STATUSES.IN_PROGRESS

        setGameState(prev => ({
            ...prev,
            guesses: updateGuesses,
            currentGuess: initialGuess,
            isCorrect,
            isGameOver,
            remainingGuesses
        }))

        updateGameContext(updateGuesses, updateStatus) // save to local storage too

        if (isGameOver) { // save stats to local storage
            setHasGameJustFinished(true)
            const { gamesPlayed, currentStreak, maxStreak, gamesWon, guesses } = gameStats
            const newStats: GameStats = {
                ...gameStats,
                gamesPlayed: gamesPlayed + 1,
                currentStreak: isCorrect ? currentStreak + 1 : 0,
                maxStreak: isCorrect
                    ? Math.max(currentStreak + 1, maxStreak)
                    : maxStreak,
                gamesWon: isCorrect ? gamesWon + 1 : gamesWon,
                guesses: { ...guesses },
                currentRow: isCorrect ? MAX_GUESSES - remainingGuesses : null
            }

            if (isCorrect) {
                const key = (MAX_GUESSES - remainingGuesses).toString() as keyof GameStats["guesses"];
                newStats.guesses[key] = guesses[key] + 1;
            }

            updateGameStats(newStats)
        }
    }

    function handleDelete() {
        const { hex, characters } = gameState.currentGuess

        if (hex.length === 0) return;

        const newCharacters = characters.map((char, i) =>
            i === hex.length - 1 ? { ...char, character: null } : char
        )
        const newHex = newCharacters.map((char) => char.character).join('')

        setGameState(prev => ({
            ...prev,
            currentGuess: {
                hex: newHex,
                characters: newCharacters,
            },
        }));
    }

    function handleDigitInput(key: Digit) {
        const { hex, characters } = gameState.currentGuess

        if (hex.length >= MAX_DIGITS) return;

        const newCharacters = characters.map((char, i) =>
            i === hex.length ? { ...char, character: key } : char
        )
        const newHex = newCharacters.map((char) => char.character).join('')

        setGameState(prev => ({
            ...prev,
            currentGuess: {
                hex: newHex,
                characters: newCharacters,
            },
        }));
    }

    const updateCurrentGuess = (keyPressed: AllowedKey) => {
        if (gameState.isGameOver) return;

        if (keyPressed === 'enter') {
            handleEnter()
            return
        }

        if (keyPressed === 'del') {
            handleDelete()
            return
        }

        handleDigitInput(keyPressed)
    }

    return { updateGuess: updateCurrentGuess, gameState, hasGameJustFinished }
}