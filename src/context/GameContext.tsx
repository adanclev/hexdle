import {createContext, useContext, useEffect, useMemo, useState} from "react"
import type {Color, HexData} from "@/features/game/types"
import type { GameStateCtx, Message, GameStatus, GameStats, GameContextProps } from "@/types"
import {useSession} from "@/context/AuthContext";
import {
    loadGameStateFromLocalStorage,
    loadGameStatsFromLocalStorage,
    saveGameStateToLocalStorage
} from "@/lib/localStorage"
import { defaultGameState, defaultGameStats } from "@/constants"
import { getGameNumber, todayToString } from "@/lib/getGameInfo"
import {getGameStateForUser, persistGameState, getStatsForUser, persistStats} from "@/features/game/services/game.service";
import {buildNextGameState} from "@/features/game/domain/game.logic";
import type {UserPreferences} from "@/features/auth/types";

const GameContext = createContext<GameContextProps>({
    gameStateCtx: defaultGameState,
    gameStats: defaultGameStats,
    message: null,
    gameLoading: true,
    toggleTheme: () => { },
    toggleDifficult: () => { },
    updateMessage: () => { },
    updateGameState: () => { },
    updateGameStats: () => { }
})

export const useGameState = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGameState must be used within a GameStateProvider")
    }
    return context;
}

export const GameStateProvider = ({ children }: { children: React.ReactNode }) => {
    const todayStr = todayToString()
    const gameNumber = useMemo(() => getGameNumber(todayStr), [todayStr]);
    const { user, authLoading, updateUserPrefs } = useSession()
    const [gameStateCtx, setGameStateCtx] = useState<GameStateCtx>(() => {
        const darkMode = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

        return { ...defaultGameState, darkMode, gameNumber }
    })
    const [gameStats, setGameStats] = useState<GameStats>(defaultGameStats)
    const [message, setMessage] = useState<Message | null>(null);
    const [gameLoading, setGameLoading] = useState<boolean>(true);

    const loadInitialGameState = async () => {
        setGameLoading(true)
        const state = user
            ? await getGameStateForUser(user, gameNumber)
            : loadGameStateFromLocalStorage()

        if (state) {
            setGameStateCtx(state)
        } else if(user) {
            const { darkMode, hardMode } = user.preferences;
            setGameStateCtx(prev => ({...prev, darkMode, hardMode }));
        }
        setGameLoading(false)
    }

    const loadGameStats = async () => {
        const state = user
            ? await getStatsForUser(user)
            : loadGameStatsFromLocalStorage()

        if (state) {
            let currentStreak = 0;
            if (state.lastPlayedGameNumber) {
                const diff = gameNumber - state.lastPlayedGameNumber;
                currentStreak = diff <= 1 ? state.currentStreak : 0;
            }

            setGameStats({...state, currentStreak });
        }
    }

    useEffect(() => {
        if (authLoading) {
            setGameLoading(true)
            return
        }

        loadInitialGameState();
        loadGameStats();
    }, [authLoading]);

    useEffect(() => {
        if (gameStateCtx.gameNumber !== gameNumber) {
            setGameStateCtx(prev => ({
                ...defaultGameState,
                hardMode: prev.hardMode,
                darkMode: prev.darkMode,
                lastPlayed: todayStr,
                gameNumber,
            }));
        }
    }, [gameStateCtx.gameNumber, gameNumber]);

    useEffect(() => {
        if (authLoading) return;

        document.documentElement.classList.toggle("dark", gameStateCtx.darkMode);
        if (!user) {
            saveGameStateToLocalStorage(gameStateCtx);
            return;
        }

        const prefs: UserPreferences = {
            darkMode: gameStateCtx.darkMode,
            hardMode: gameStateCtx.hardMode,
        }
        const persistPrefs = setTimeout(() => updateUserPrefs(prefs), 1500);

        return () => clearTimeout(persistPrefs);
    }, [gameStateCtx.darkMode, gameStateCtx.hardMode])

    const toggleTheme = () => {
        setGameStateCtx(prev => ({
            ...prev,
            darkMode: !prev.darkMode
        }))
    }

    const toggleDifficult = () => {
        setGameStateCtx(prev => ({
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

    const updateGameState = async (
        guesses: HexData[],
        status: GameStatus,
        answer: Color,
    ) => {
        const nextState = buildNextGameState(
            gameStateCtx,
            guesses,
            status,
            todayStr,
            gameNumber,
        )

        setGameStateCtx(nextState);
        const result = await persistGameState(user, nextState, answer);
        if (result) setGameStateCtx(prev => ({ ...prev, id: result }));
    }

    const updateGameStats = async (stats: GameStats) => {
        if (!stats) return;

        setGameStats(stats);
        await persistStats(user, stats);
    }

    return (
        <GameContext.Provider value={{ gameStateCtx, gameStats, message, gameLoading, toggleTheme, toggleDifficult, updateMessage, updateGameState, updateGameStats }}>
            {children}
        </GameContext.Provider>
    )
}
