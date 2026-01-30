import type { Color } from '@/features/game/types'
import { colors } from "@/features/game/constants/colorList"
import type {Digit} from "@/types";

export function getDailyRandomElement(dateKey: string): Color {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = dateKey.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  const newHex = colors[index].hex.slice(1)
  const dailyColor: Color = {
    name: colors[index].name,
    hex: newHex,
    characters: newHex.split('').map(
        (c) => ({ character: c as Digit}))
  }

  return dailyColor;
}
