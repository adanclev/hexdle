import type {UserWithPreferences} from "@/features/auth/types";
import type {GameStateCtx, GameStats, GameStatus} from "@/types";
import type {Color} from "@/features/game/types";
import {supabaseClient} from "@/lib/supabase";
import {saveGameStateToLocalStorage, saveGameStatsToLocalStorage} from "@/lib/localStorage";
import {buildGuessHistogram} from "@/features/game/domain/game.logic";
import {defaultGameState} from "@/constants.ts";

export async function getGameStateForUser (
    user: UserWithPreferences,
    gameNumber: number
): Promise<GameStateCtx | null>{
    const { data, error } = await supabaseClient
        .from('games')
        .select('id, game_status, n_day, guesses, started_at')
        .eq("user_id", user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

    if (error) {
        console.error("[Supabase Error]:", error.message);
        return null;
    }


    if (data && data.n_day === gameNumber) {
        const savedGameState: GameStateCtx = {
            id: data.id,
            boardState: data.guesses as string[],
            status: data.game_status as GameStatus,
            hardMode: user.preferences.hardMode,
            darkMode: user.preferences.darkMode,
            lastPlayed: data.started_at,
            gameNumber: data.n_day,
        };
        return savedGameState;
    }

    return {
        ...defaultGameState,
        hardMode: user.preferences.hardMode,
        darkMode: user.preferences.darkMode,
        gameNumber,
    };
}

async function saveGameStateToDB (
    user: UserWithPreferences,
    gameState: GameStateCtx,
    answer: Color
): Promise <number | null> {
    const { id, boardState, status, gameNumber, lastPlayed, hardMode } = gameState;

    if (!status || !answer || !gameNumber) {
        console.error("[Save Error]: Mising information", { status, answer, gameNumber });
        return null;
    }

    const { data, error } = await supabaseClient
        .from('games')
        .upsert({
            ...(id
                ? { id: id, }
                : { started_at: lastPlayed, }),
            user_id: user.id,
            solution: answer.hex,
            n_day: gameNumber,
            game_status: status,
            guesses: boardState,
            hard_mode: hardMode,
        }).select('id').single()

    if (error) {
        console.error("[Supabase Error]:", error.message);
        return null;
    }

    return data.id;
}

export async function persistGameState (
    user: UserWithPreferences | null,
    gameState: GameStateCtx,
    answer: Color,
): Promise<number | null> {
    if (!user) {
        saveGameStateToLocalStorage(gameState);
        return null;
    }

    const result = await saveGameStateToDB(user, gameState, answer);

    return result;
}

export async function getStatsForUser (
    user: UserWithPreferences
): Promise<GameStats | null> {
    const { data, error } = await supabaseClient
        .from('stats')
        .select('games_played, games_won, current_streak, max_streak, guess_distribution, current_row, last_played_game_number')
        .eq('user_id', user.id)
        .single()

    if (error) {
        console.error("[Supabase Error]:", error.message);
        return null;
    }

    if (!data) return null;

    const guess_histogram = buildGuessHistogram(data.guess_distribution as number[])

    const savedStats: GameStats = {
        gamesPlayed: data.games_played,
        gamesWon: data.games_won,
        currentStreak: data.current_streak,
        maxStreak: data.max_streak,
        guesses: guess_histogram,
        currentRow: data.current_row,
        lastPlayedGameNumber: data.last_played_game_number,
    }

    return savedStats;
}

async function saveStatsToDB (
    user: UserWithPreferences,
    stats: GameStats,
) {
    const { gamesPlayed, gamesWon, currentStreak, maxStreak, guesses, currentRow, lastPlayedGameNumber } = stats;
    const today = new Date().toISOString();
    const orderedKeys = ["1", "2", "3", "4", "5", "6"] as const;
    const guessDistribution = orderedKeys.map(key => guesses[key]);

    const { error } = await supabaseClient
        .from('stats')
        .update({
            games_played: gamesPlayed,
            games_won: gamesWon,
            current_streak: currentStreak,
            max_streak: maxStreak,
            guess_distribution: guessDistribution,
            current_row: currentRow,
            last_played_at: today,
            last_played_game_number: lastPlayedGameNumber,
        }).eq('user_id', user.id)

    if (error) {
        console.error("[Supabase Error]:", error.message);
        return;
    }

    return;
}

export async function persistStats (
    user: UserWithPreferences | null,
    stats: GameStats,
): Promise<void> {
    if (!user) {
        saveGameStatsToLocalStorage(stats);
        return;
    }

    await saveStatsToDB(user, stats);
}
