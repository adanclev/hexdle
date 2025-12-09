import { feedbackWords, GAME_STATUSES } from "@/constants";
import type { HexData, HexDigit } from "@/features/game/types";
import { STATUSES, MAX_GUESSES } from "@/features/game/constants";
import type { GameStatus } from "@/types";

export function getGameNumber(dateStr: string) {
    const startDate = new Date('2025-06-26');
    const dateObj = new Date(dateStr)
    
    startDate.setHours(0, 0, 0, 0);
    dateObj.setHours(0, 0, 0, 0);
    
    const diff = dateObj.getTime() - startDate.getTime();
    const daysPassed = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    return daysPassed + 1;
}

export function getGameInfo() {
    const today = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    today.setHours(0, 0, 0, 0);

    const todayToString = `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
    const gameNumber = getGameNumber(today.toISOString().split('T')[0])

    return { gameNumber, todayToString };
}

export function todayToString() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0]; // "2025-06-26"

    return todayStr
}

export function getFeedbackWord(attempts: number): string {
    const words = feedbackWords[attempts] || ["Nice"]
    const randomIndex = Math.floor(Math.random() * words.length)
    return words[randomIndex]
}

function getHexEmoji(char: HexDigit): string {
    if (char?.status === STATUSES.CHARS.HIGH) return '🔼';
    if (char?.status === STATUSES.CHARS.LOW) return '🔽';
    return '🟩';
}

export function generateShareText({ guesses, isWin, hardMode }: { guesses: HexData[]; isWin: boolean, hardMode: boolean }) {
    const { gameNumber } = getGameInfo();
    const hexEmojis: string[] = []

    for (const guess of guesses) {
        const { characters } = guess
        const hexEmoji = characters.map((char) => getHexEmoji(char)).join('');
        hexEmojis.push(hexEmoji)
    }

    const attempts = `${isWin ? guesses.length : 'X'}/${MAX_GUESSES}${hardMode ? '*' : ''}`
    return `Hexdle No. ${gameNumber} ${attempts}\n\n${hexEmojis.join('\n')}`
}

export function getGameSubtitle({ status, guesses }: { status: GameStatus | null, guesses: string[] }) {
  const isGameOver = status && status !== GAME_STATUSES.IN_PROGRESS
  const attempts = guesses?.length ?? 0

  if (!status) return 'Get 6 chances to guess a hex color.'

  if (isGameOver) {
    return status === GAME_STATUSES.WON
      ? "Great job on today’s puzzle! Check out your progress."
      : "Tomorrow's a new day, with a new puzzle. See you then."
  }

  return `You've made ${attempts} of ${MAX_GUESSES} guesses. Keep it up!`
}

// localStorage.setItem("hexdle_game_state", JSON.stringify({
//   boardState: ["535835", "8A6645", "DCA445", "AE8245"],
//   hardMode: false,
//   darkMode: false,
//   status: "won",
//   lastPlayed: "2025-07-07"
// }));