import { GAME_STATUSES } from '@/constants'
import { getGameInfo, getGameSubtitle } from '@/lib/getGameInfo'
import type { GameStatus } from '@/types'
import {useNavigate} from 'react-router'
import { useSession } from '@/context/AuthContext';

interface Props {
    onClickPlay?: () => void,
    status: GameStatus | null,
    guesses: string[]
}

export const SplashPage = ({ onClickPlay, status, guesses }: Props) => {
    const { session } = useSession();
    const { gameNumber, todayToString } = getGameInfo()
    const navigate = useNavigate()
    const isGameOver = status && status !== GAME_STATUSES.IN_PROGRESS
    const subtitle = getGameSubtitle({status, guesses})
    const textButton = isGameOver
        ? 'See Stats'
        : 'Play'

    return (
        <div className="flex flex-col items-center justify-center h-screen mx-auto md:mx-40 text-primary-light dark:text-primary-dark">
            <h1 className="shine-title delay-500 text-[70px] md:text-[90px] ">
                Hexdle
            </h1>
            <h2 className="text-4xl/10 md:text-5xl/15 text-center mx-10">
                {subtitle}
            </h2>

            <div className="flex flex-col items-center justify-evenly md:flex-row gap-4 my-10 w-full xl:w-1/2">
                {!session && <button
                    className="btn btn-splash-page border-[1.6px] border-solid border-light-400 dark:border-dark-400"
                    onClick={() => navigate("/auth/sign_in")}
                >
                    Log in
                </button>}
                <button
                    className="btn btn-splash-page bg-light-300 dark:bg-dark-300"
                    onClick={onClickPlay}
                >
                    {textButton}
                </button>
            </div>
            <p className="font-bold text-md md:text-lg">
                {todayToString}
            </p>
            <p className="text-md md:text-lg">
                {`No. ${gameNumber}`}
            </p>
        </div>
    );
}
