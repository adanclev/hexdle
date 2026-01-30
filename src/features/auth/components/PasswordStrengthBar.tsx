import { TileView } from "@/components/TileView";
import type { StrengthBarDigits } from "@/features/auth/types";
import type { Digit } from "@/types";

interface Props {
    digits: StrengthBarDigits,
    strength: number,
}

export const PasswordStrengthBar = ({ digits, strength }: Props) => {
    const evaluation = (value: number):number => {
        if (value <= 0) return 0;
        if (value >  16) return 15;
        return value - 1;
    }

    const hexcode = evaluation(strength).toString(16) as Digit;
    // console.log(strength, hexcode);
    const colorsito = digits[hexcode];

    return (
        <div className="grid auto-cols-auto grid-flow-col gap-1">
            {(Object.keys(digits) as Digit[]).map((digit, i) =>
                <TileView
                    key={digit}
                    state={i < strength ? 'tile-submitted' : 'tile-filled'}
                    color={colorsito}
                    animation={i < strength ? 'animate-flip-in' : null}
                >
                    <p
                        className="text-[12px] md:text-[14px]"
                    >
                        {digit}
                    </p>
                </TileView>
            )}
        </div>
    )
}
