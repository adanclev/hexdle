import {useState, useEffect } from "react";
import { TileView } from "@/components/TileView";

export const LoadingTile = ({ label = 'Loading...' }: { label: string }) => {
    const colors = ['red-low', 'red-match', 'red-high','blue-low', 'blue-match', 'blue-high', 'green-low', 'green-match', 'green-high']
    const [channel, setChannel] = useState(0);

    useEffect(() => {
        const i = setInterval(() => {
            setChannel(c => (c + 1) % colors.length)
        }, 500)

        return () => clearInterval(i)
    }, [])

    return (
        <div className="flex w-full items-center justify-center gap-2">
            <div className="size-5">
                {/*<span className="w-4 h-4 rounded-full border-2 border-imperial-red border-t-black animate-spin"/>*/}
                <TileView state={'tile-submitted'} color={colors[channel]} delay={0} animation={["animate-flip-in", 'animate-flip-out']}>
                    <span className="invisible">0</span>
                </TileView>
            </div>
            <p>{label}</p>
        </div>
    )
}
