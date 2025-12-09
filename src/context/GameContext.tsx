import { defaultGameState, defaultGameStats } from "@/constants"
import type { HexData } from "@/features/game/types"
import { loadGameStateFromLocalStorage, loadGameStatsFromLocalStorage, saveGameStatsToLocalStorage, saveGameStateToLocalStorage } from "@/lib/localStorage"
import type { StoredGameState, Message, GameStatus, GameStats } from "@/types"
import { useEffect, useState } from "react"
import { getGameNumber, todayToString } from "@/lib/getGameInfo"
import { GameContext } from "@/context/GameObjectContext"

export const GameStateProvider = ({ children }: { children: React.ReactNode }) => {
    const [gameContext, setGameContext] = useState<StoredGameState>(() => {
        const storedGameState = loadGameStateFromLocalStorage()

        if (storedGameState) return storedGameState;

        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            const newGameState: StoredGameState = {
                ...defaultGameState,
                darkMode: true
            }
            return newGameState
        }

        return defaultGameState
    })
    const [gameStats, setGameStats] = useState<GameStats>(() => {
        const storedGameStats = loadGameStatsFromLocalStorage()

        if (storedGameStats) {
            if (gameContext?.lastPlayed) {
                const todayStr = todayToString()
                const userLastPlayedGameNumber = getGameNumber(gameContext.lastPlayed)
                const todayGameNumber = getGameNumber(todayStr)
                const sameGameNumber = userLastPlayedGameNumber === todayGameNumber
                const continuedStreak = userLastPlayedGameNumber === (todayGameNumber - 1)

                const newCurrentStreak = continuedStreak
                    ? storedGameStats.currentStreak
                    : 0

                return {
                    ...storedGameStats,
                    currentStreak: sameGameNumber ? storedGameStats.currentStreak : newCurrentStreak
                }
            }
            return storedGameStats
        }

        return defaultGameStats
    })

    const [message, setMessage] = useState<Message | null>(null)

    useEffect(() => {
        const todayStr = todayToString()
        if (gameContext?.lastPlayed && gameContext.lastPlayed !== todayStr) {
            setGameContext(prev => ({
                ...prev,
                boardState: [],
                lastPlayed: todayStr,
                status: null
            }))
        }
        document.documentElement.classList.toggle("dark", gameContext.darkMode)
        saveGameStateToLocalStorage(gameContext)
    }, [gameContext])

    useEffect(() => {
        if (!gameStats) return
        saveGameStatsToLocalStorage(gameStats)
    }, [gameStats])

    const toggleTheme = () => {
        setGameContext(prev => ({
            ...prev,
            darkMode: !prev.darkMode
        }))
    }

    const toggleDifficult = () => {
        setGameContext(prev => ({
            ...prev,
            hardMode: !prev.hardMode
        }))
    }

    const updateMessage = (msg: Message | null) => {
        if (msg) {
            setMessage(msg)
        } else {
            setMessage(null)
        }
    }

    const updateGameContext = (
        currentGuesses: HexData[],
        status: GameStatus
    ) => {
        const todayStr = todayToString()
        const guesses = currentGuesses.map((guess) => guess.hex)

        setGameContext(prev => ({
            ...prev,
            boardState: guesses,
            status,
            lastPlayed: todayStr
        }))
    }

    const updateGameStats = (newStats: GameStats) => {
        if (!newStats) return
        setGameStats(newStats)
    }

    return (
        <GameContext.Provider value={{ gameContext, gameStats, message, toggleTheme, toggleDifficult, updateMessage, updateGameContext, updateGameStats }}>
            {children}
        </GameContext.Provider>
    )
}
