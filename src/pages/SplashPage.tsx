import { GAME_STATUSES } from '@/constants'
import { getGameInfo, getGameSubtitle } from '@/lib/getGameInfo'
import {useNavigate} from 'react-router'
import { useSession } from '@/context/AuthContext';
import {useGameState} from "@/context/GameContext.tsx";

interface Props {
    onClickPlay?: () => void,
}

export const SplashPage = ({ onClickPlay }: Props) => {
    const { session } = useSession();
    const { gameStateCtx: {status, boardState}, gameLoading: loading } = useGameState();
    const { gameNumber, todayToString } = getGameInfo()
    const navigate = useNavigate()
    const isGameOver = status && status !== GAME_STATUSES.IN_PROGRESS
    const subtitle = getGameSubtitle(status, boardState)
    const textButton = isGameOver
        ? 'See Stats'
        : 'Play'

    return (
        <div
            className="flex flex-col bg-[#e3e3e1] items-center justify-center h-screen p-auto text-primary-light ">
            <h1 className="shine-title delay-500 text-[70px] md:text-[90px] ">
                Hexdle
            </h1>

            <section className="flex flex-col items-center justify-start m-0 relative">
                <h2 className={`text-4xl/10 md:text-5xl/15 text-center mx-10 ${loading ? "invisible" : "visible"}`}>
                    {subtitle}
                </h2>

                <div className={`flex flex-col items-center justify-evenly md:flex-row gap-4 my-10 w-full xl:w-1/2 ${loading ? "invisible" : "visible"}`}>
                    {!session && <button
                        className="btn btn-splash-page border-[1.6px] border-solid border-light-400"
                        onClick={() => navigate("/auth/sign_in")}
                    >
                        Log in
                    </button>}
                    <button
                        className="btn btn-splash-page bg-light-300"
                        onClick={onClickPlay}
                    >
                        {textButton}
                    </button>
                </div>

                {loading &&
                    <div className="size-20 border-3 border-light-400 border-b-light-100 rounded-full animate-spin absolute"/>
                }
            </section>

            <p className="font-bold text-md md:text-lg">
                {todayToString}
            </p>
            <p className="text-md md:text-lg">
                {`No. ${gameNumber}`}
            </p>
        </div>
    );
}
