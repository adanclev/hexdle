import { useEffect, useState } from "react";
import { colorClasses, defaultTileDelay, STATUSES } from "@/features/game/constants";
import type { HexDigit } from "@/features/game/types";
import { TileView } from "@/components/TileView/TileView.tsx";

interface Props {
    hexDigit: HexDigit,
    index: number,
    onModal?: boolean,
    status?: string
}

export const Tile = ({ hexDigit, index, onModal, status }: Props) => {
    const [playWinAnimation, setPlayWinAnimation] = useState<boolean>(false)
    const milliseconds = onModal ? 350 : index * defaultTileDelay

    useEffect(() => {
        if (status === STATUSES.GUESS.CORRECT) {
            const delay = setTimeout(() => {
                setPlayWinAnimation(true)
            }, milliseconds + 2000)

            return () => clearTimeout(delay)
        }
    }, [status])

    const color = hexDigit.color && hexDigit.status
        ? colorClasses[hexDigit.color][hexDigit.status]
        : null

    const state = !hexDigit.character
        ? 'tile-empty'
        : color ? 'tile-submitted' : 'tile-filled'

    const animate = playWinAnimation
        ? 'animate-bounce'
        : state === 'tile-filled'
            ? 'animate-pop-scale'
            : color
                ? 'animate-flip-in'
                : 'animate-idle'

    return (
        <TileView
            delay={milliseconds}
            state={state}
            color={color}
            animation={animate}
        >
            <p
                className="text-[24px] md:text-[28px]"
            >
                {hexDigit.character ?? ''}
            </p>
        </TileView>
    )
}
