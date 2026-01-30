import { useState, useEffect, useReducer } from "react";
import { animationReducer } from "@/components/TileView/animationReducer";
import type { AnimationState } from "@/components/TileView/types";

interface Props {
    children: React.ReactNode, // Expected to be a <p> element with the character
    state: string,
    color: string | null,
    delay?: number,
    animation?: AnimationState | AnimationState[] | null,
}

export const TileView = ({ children, state, color, delay=0, animation='animate-idle' }: Props) => {
    const [animationController, dispatch] = useReducer(animationReducer, { state: "animate-idle" });
    const [showColor, setShowColor] = useState<boolean>(false);

    useEffect(() => {
        if (!animation) {
            setShowColor(state === 'tile-submitted');
            return;
        }

        if (animation === "animate-idle") return;

        if (Array.isArray(animation)) {
            dispatch({ type: "LOOP", sequence: animation });
        } else {
            dispatch({ type: "START", animation });
        }
    }, [animation]);

    const handleAnimationEnd = () => {
        const loop = animationController.lastAction?.type === "LOOP";

        if (Array.isArray(animation) && loop) {
            dispatch({ type: "LOOP", sequence: animation });
        } else {
            dispatch({ type: "END" });
        }

        setShowColor(state === 'tile-submitted');
    };

    return (
        <div
            className={`tile ${state} ${animationController.state} ${showColor ? color : ""}`}
            style={ animationController.state === "animate-flip-in"
                ? { animationDelay: `${delay}ms` }
                : undefined}
            onAnimationEnd={handleAnimationEnd}
        >
            {children}
        </div>
    )
}