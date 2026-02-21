import { useEffect, useState } from "react";
import { MSG_CODE } from '@/features/game/constants'

interface Props {
    text?: string,
    code?: string
}

export const Tooltip = ({ text, code }: Props) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`${code === MSG_CODE.HARD_MODE ? 'z-50' : 'z-10'} absolute top-0 bg-black/85 mt-2 px-5 py-2 ${code === MSG_CODE.GAME_OVER ? "uppercase" : ""} rounded-md transition-all duration-300 ease-out ${visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
                }`}
        >
            <p className="text-white">{text}</p>
        </div>
    )
}
