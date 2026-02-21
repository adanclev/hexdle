import type { GameStats } from "@/types"
import {useGameState} from "@/context/GameContext";
import { StatCard } from "@/components/StatCard"
import { GuessDistribution } from "@/components/GuessDistribution"

export const Stats = () => {
    const { gameStats } = useGameState();

    return (
        <section className="w-full sm:w-[350px] h-fit text-primary-light dark:text-primary-dark">
            <ContentStats gameStats={gameStats}/>
            {/* <StartTracking /> */}
        </section>
    )
}

interface ContentStatsProps {
    gameStats: GameStats
}

export const ContentStats = ({ gameStats }: ContentStatsProps) => {
    const { gamesPlayed, gamesWon, currentStreak, maxStreak, guesses, currentRow } = gameStats
    const winRate = gamesPlayed > 0 
        ? Math.round((gamesWon / gamesPlayed) * 100)
        : 0

    return (
        <section>
            <header>
                <h1 className="text-[20px] md:text-[22px] font-bold mb-2 text-primary-light dark:text-primary-dark">Statistics</h1>
            </header>
            <article className="grid grid-cols-4 gap-2 mb-2 text-center items-start">
                <StatCard label={"Played"} value={gamesPlayed}/>
                <StatCard label={"Win %"} value={winRate}/>
                <StatCard label={"Current streak"} value={currentStreak}/>
                <StatCard label={"Max streak"} value={maxStreak}/>
            </article>

            <GuessDistribution guesses={guesses} currentRow={currentRow}/>
        </section>
    )
}

// export const StartTracking = () => {
//     return (
//         <section className="w-full h-fit flex flex-col items-center justify-center text-center text-primary-light dark:text-primary-dark">
//             <h2 className="text-[22px] md:text-[24px] font-semibold mt-4">Want to start tracking your stats and streaks?</h2>
//             <button
//                 className="btn btn-modal mt-6 mb-4 w-full sm:w-[300px] text-[16px] md:text-[18px] font-semibold"
//             >
//                 Create an account
//             </button>
//             <a
//                 href="#"
//                 className="text-[14px] md:text-[16px] underline hover:text-light-400 transition-colors duration-200 select-none"
//             >
//                 Already registered? Log in
//             </a>
//         </section>
//     )
// }
