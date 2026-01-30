import { PasswordStrengthBar } from '@/features/auth/components/PasswordStrengthBar'
import { passwordStrength, STRENGTH_BAR_DIGITS } from "@/features/auth/utils/passwordStrength";
import { useMemo } from 'react';

interface Props {
    text?: string,
}

export const PasswordStrengthMeter = ({ text }: Props) => {
    const level = useMemo(() => {
        console.log("Memo")
        return text ? passwordStrength(text) : 0
    }, [text])

    const legend = level <= 2 ? "Very weak"
        : level <= 7 ? "Weak"
            : level <= 11 ? "Good"
                : level <= 13 ? "Strong"
                    : "Very Strong";

    return (
        <section className="inline mt-2">
            <PasswordStrengthBar digits={STRENGTH_BAR_DIGITS} strength={level}/>
            <p>
                Strength: {legend}
            </p>
        </section>
    )
}
