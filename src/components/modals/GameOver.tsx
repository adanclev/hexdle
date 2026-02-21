import { Stats } from "@/components/modals/Stats";
import type { Color, HexData } from "@/features/game/types";
import { generateShareText } from "@/lib/getGameInfo";
import { useState } from "react";

interface Props {
    answer: Color,
    guesses: HexData[],
    won: boolean,
    hardMode: boolean
}

export const GameOver = ({ answer, guesses, won, hardMode }: Props) => {
    const { hex, name } = answer
    const color = `#${hex}`
    const shareResultText = generateShareText(guesses, won, hardMode)
    const resultMessage = won
        ? 'Congratulations!'
        : 'Thanks for playing today!'
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareResultText).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1000);
            });
        }
    };

    return (
        <section className="w-full sm:w-[350px] h-fit flex flex-col items-center justify-center text-primary-light dark:text-primary-dark">
            <header className="flex flex-col items-center justify-center">
                <div
                    className="rounded-xl p-[6px] md:p-2 mb-4"
                    style={{ backgroundColor: color }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-12 md:size-18 bg-modal/50 dark:bg-modal-dark/50 rounded-lg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                    </svg>
                </div>
                <h1 className="text-[24px] md:text-[28px] text-center font-bold mb-2 px-10">{resultMessage}</h1>
            </header>
            {won &&
                <>
                    <p
                        className="text-[16px] md:text-[18px]"
                    >You found the color: <span className="font-bold uppercase" style={{ color: color }}>{color}</span></p>
                    <p>
                        Name of color: <span className="font-semibold" style={{ color: color }}>{name}</span>
                    </p>
                </>
            }

            <Stats />

            <button
                className="btn btn-modal flex justify-center items-center gap-2 mt-6 mb-4 w-1/2 font-semibold"
                onClick={handleCopy}
            >
                {copied ? (
                    'Copied!'
                ) : (
                    <>
                        Share
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                            />
                        </svg>
                    </>
                )}
            </button>
        </section>
    )
}
