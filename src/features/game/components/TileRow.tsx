import { useEffect, useReducer } from "react";
import { STATUSES } from '@/features/game/constants'
import { Tile } from "@/features/game/components/Tile";
import { animationReducer } from "@/components/TileView/animationReducer";
import type { HexDigit } from "@/features/game/types";

interface Props {
    tiles: HexDigit[],
    status?: string
}

export const TileRow = ({ tiles, status }: Props) => {
    const [animationState, dispatch] = useReducer(animationReducer, { state:"animate-idle" });

    useEffect(() => {
        if (status !== STATUSES.GUESS.ERROR ) return;
        dispatch({ type: "START", animation: 'animate-shake' })
    }, [status]);

    return (
        <div
            className={`grid grid-cols-6 gap-2 h-[55px] w-[350px] ${animationState.state}`}
            onAnimationEnd={() => dispatch({ type: 'END' })}
        >
            {tiles.map((tile, index) =>
                <Tile key={index} hexDigit={tile} index={index} status={status} />
            )}
        </div>
    );
}
