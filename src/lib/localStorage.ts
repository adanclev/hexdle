import type { GameStateCtx, GameStats } from "@/types"

const statsKey = 'hexdle_game_stats'
const stateKey = 'hexdle_game_state'

export const saveGameStateToLocalStorage = (gameState: GameStateCtx) => {
    try {
        if (typeof window === 'undefined') return;
        const serialized = JSON.stringify(gameState);
        localStorage.setItem(stateKey, serialized);
    } catch (error) {
        console.warn(`Error saving to localStorage with key "${stateKey}":`, error);
    }
}

export const loadGameStateFromLocalStorage = () => {
    try {
        if (typeof window === 'undefined') return null;
        const data = localStorage.getItem(stateKey);
        return data ? (JSON.parse(data) as GameStateCtx) : null;
    } catch (error) {
        console.warn(`Error loading from localStorage with key "${stateKey}":`, error);
        return null;
    }
};

export const saveGameStatsToLocalStorage = (
    gameStats: GameStats
) => {
    try {
        if (typeof window === 'undefined') return;
        const serialized = JSON.stringify(gameStats);
        localStorage.setItem(statsKey, serialized);
    } catch (error) {
        console.warn(`Error saving game stats to localStorage with key "${statsKey}":`, error);
    }
};

export const loadGameStatsFromLocalStorage = (): GameStats | null => {
    try {
        if (typeof window === 'undefined') return null;
        const data = localStorage.getItem(statsKey);
        return data ? (JSON.parse(data) as GameStats) : null;
    } catch (error) {
        console.warn(`Error loading game stats from localStorage with key "${statsKey}":`, error);
        return null;
    }
};