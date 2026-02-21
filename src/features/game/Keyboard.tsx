import { useEffect, useRef } from "react"
import { Key } from "@/features/game/components/Key"
import { KEYS_ALLOWED } from "@/features/game/constants"
import type { AllowedKey } from "@/features/game/types";

const keyboard: AllowedKey[][] = [
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    ['enter', 'a', 'b', 'c', 'd', 'e', 'f', 'del']
]

interface Props {
    updateGuess: (keyPressed: AllowedKey) => void,
    isModalVisible: boolean,
    loading: boolean,
    gameOver: boolean,
}

export const Keyboard = ({ updateGuess, isModalVisible, loading, gameOver }: Props) => {
    const pressedKeys = useRef<Set<string>>(new Set())
    useEffect(() => {
        if (!isModalVisible) {
            window.addEventListener('keydown', handleKeyDown)
            window.addEventListener('keyup', handleKeyUp)
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [isModalVisible, updateGuess])

    const normalizeKey = (key: string) => {
        const keyPressed = key.toLowerCase()
        if (keyPressed === "backspace" || keyPressed === "delete") return 'del';
        return keyPressed;
    }

    const isAllowedKey = (key: string): key is AllowedKey => {
        return KEYS_ALLOWED.includes(key as AllowedKey);
    }

    const onPress = (value: string) => {
        if (loading || gameOver) return;

        const keyPressed = normalizeKey(value)
        if (isAllowedKey(keyPressed)) {
            updateGuess(keyPressed)
        }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        if (loading || gameOver) return;

        const keyPressed = normalizeKey(event.key);
        if (isAllowedKey(keyPressed)) {
            if (pressedKeys.current.has(keyPressed)) return;

            pressedKeys.current.add(keyPressed)
            updateGuess(keyPressed)
        }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
        const keyPressed = normalizeKey(event.key)

        if (isAllowedKey(keyPressed)) {
            pressedKeys.current.delete(keyPressed)
        }
    }

    return (
        <section 
            className="flex flex-col items-center justify-center gap-2"
        >
            {keyboard.map((keys, idx) => (
                <div 
                    key={idx} 
                    className="grid auto-cols-max grid-flow-col w-full justify-center gap-1.5 md:gap-2"
                >
                    {keys.map((keyName: AllowedKey) => (
                        <Key key={keyName} keyName={keyName} special={['enter', 'del'].includes(keyName)} onPress={onPress} />
                    ))}
                </div>
            ))
            }
        </section>

    )
}
