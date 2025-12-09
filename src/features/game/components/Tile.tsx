import { useEffect, useState } from "react";
import { colorClasses, defaultTileDelay, STATUSES } from "@/features/game/constants";
import type { HexDigit } from "@/features/game/types";

interface Props {
    hexDigit: HexDigit,
    index: number,
    onModal?: boolean,
    status?: string
}

export const Tile = ({ hexDigit, index, onModal, status }: Props) => {
    const [showColor, setShowColor] = useState<boolean>(false)
    const [playWinAnimation, setPlayWinAnimation] = useState<boolean>(false)
    const ms = onModal ? 350 : index * defaultTileDelay

    useEffect(() => {
        if (hexDigit.color && hexDigit.status) {
            const timer = setTimeout(() => {
                setShowColor(true)
            }, ms);

            return () => clearTimeout(timer)
        }
    }, [hexDigit.color, hexDigit.status])

    useEffect(() => {
        if (status === STATUSES.GUESS.CORRECT) {
            const delay = setTimeout(() => {
                setPlayWinAnimation(true)
            }, ms + 2000)

            return () => clearTimeout(delay)
        }
    }, [status])

    const colorClass =
        showColor && hexDigit.color && hexDigit.status
            ? `${colorClasses[hexDigit.color][hexDigit.status]}`
            : hexDigit.character
                ? 'animate-pop-scale empty-tile'
                : 'border-light-300 dark:border-dark-300'
    const animation = playWinAnimation
        ? 'animate-bounce'
        : showColor ? 'animate-flip dark:animate-flip-dark' : ''

    return (
        <div
            className={`flex items-center justify-center border-solid border-2 select-none ${colorClass} h-full w-full ${animation}`}
        >
            <p
                className="text-[24px] md:text-[28px] dark:text-primary-dark"
            >
                {hexDigit.character ?? ''}
            </p>
        </div>
    )
}
