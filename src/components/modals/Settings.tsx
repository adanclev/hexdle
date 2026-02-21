import {useNavigate} from "react-router";
import {useSession} from "@/context/AuthContext";
import { useGameState } from "@/context/GameContext";
import { MSG_TYPE, MSG_CODE } from '@/features/game/constants'

export const Settings = () => {
    const { gameStateCtx, toggleTheme, toggleDifficult } = useGameState()
    const { session, signOut } = useSession();
    const { status, hardMode, darkMode } = gameStateCtx;
    const navigate = useNavigate();

    const softReload = () => {
        navigate("/", { replace: true });
        window.location.reload();
    };

    return (
        <section className="w-full sm:w-[350px] h-fit text-primary-light dark:text-primary-dark">
            <header className="">
                <h2 className="text-[18px] md:text-[20px] font-bold mb-2">Settings</h2>
            </header>

            <div className="grid grid-flow-row auto-rows-max divide-y-2 divide-gray-200">
                <Setting
                    title="Hard Mode"
                    description="Each guess is evaluated in pairs of hexadecimal digits."
                >
                    <ToggleSwitch isGameStarted={!!status} flag={hardMode} toggleFunc={toggleDifficult} />
                </Setting>
                <Setting
                    title="Dark Mode"
                >
                    <ToggleSwitch flag={darkMode} toggleFunc={toggleTheme} />
                </Setting>
                {session
                    ? <Setting
                        title="Log out"
                    >
                        <button type="button" className="cursor-pointer" onClick={async () => {
                            await signOut();
                            softReload();
                        }}>
                            <svg className="size-8 md:size-10" viewBox="0 0 24 24" fill="None">
                                <path d="M16.5 15V19.5H5.5V5.5H16.5V10M10 12.5H22.5" stroke="currentColor" strokeWidth="1.2"/>
                                <path d="M20 10L22.5 12.5L20 15" stroke="currentColor" strokeWidth="1.2"/>
                            </svg>
                        </button>
                    </Setting>
                    : <Setting
                        title="Track Your Stats"
                        description="Sign in to save your progress, stats, and personal records."
                    >
                        <button className="cursor-pointer" onClick={() => navigate("/auth/sign_in")}>
                            <svg className="size-8" fill="currentColor" viewBox="0 0 24 24">
                                <g id="login">
                                    <path
                                        d="M24,23H9v-8h2v6h11V3H11v6H9V1h15V23z M14.7,17.7l-1.4-1.4l3.3-3.3H1v-2h15.6l-3.3-3.3l1.4-1.4l5.8,5.7L14.7,17.7z"/>
                                </g>
                            </svg>
                        </button>
                    </Setting>
                }
                {/* <Setting
                    title="High Contrast Mode"
                    description="Lorem ipsum dolor."
                    flag={false}
                    toggleFunc={() => { }}
                /> */}
            </div>
        </section>
    )
}

interface SettingProps {
    title: string,
    description?: string,
    children: React.ReactNode,
}

const Setting = ({ title, description, children }: SettingProps) => {
    return (
        <article className="flex flex-row justify-between items-center gap-8 md:gap-4 p-2 md:p-4">
            <section className="items-center">
                <h3 className="text-[16px] font-bold">{title}</h3>
                <p className="text-[12px]">{description ?? ''}</p>
            </section>
            {children}
        </article>
    )
}

interface SwitchProps {
    isGameStarted?: boolean,
    flag: boolean,
    toggleFunc: () => void
}

const ToggleSwitch = ({ isGameStarted, flag, toggleFunc }: SwitchProps) => {
    const { updateMessage } = useGameState()
    const bgColor = !flag && isGameStarted // Hard mode condition
        ? 'bg-gray-300 dark:bg-gray-600'
        : flag
            ? 'bg-green-400'
            : 'bg-gray-400 dark:bg-gray-500'

    const bgColorToggle = !flag && isGameStarted ? 'bg-white/50' : 'bg-white' // Hard mode condition

    return (
        <div
            className={`w-10 h-6 flex shrink-0 items-center rounded-full p-1 duration-300 ease-in-out cursor-pointer ${bgColor}`}
            onClick={() => {
                if (!flag && isGameStarted) { // Hard mode condition
                    updateMessage({
                        type: MSG_TYPE.INFO,
                        text: 'Hard mode can only enabled at the start of a round',
                        code: MSG_CODE.HARD_MODE
                    })
                    return
                }
                toggleFunc()
            }}
        >
            <div className={`${bgColorToggle} size-4 rounded-full shadow-md transform duration-300 ease-in-out cursor-pointer ${flag ? 'translate-x-4' : ''}`} />
        </div>
    )
}
