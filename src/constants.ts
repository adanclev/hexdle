import type { Rule, Example, StoredGameState, GameStats, ViewsMap } from "@/types";

export const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'] as const;

export const RGB_COLORS = {
    RED: 'red',
    GREEN: 'green',
    BLUE: 'blue'
} as const;

export const rules: Rule[] = [
    {
        id: 1,
        text: "Each guess must be a valid hex color code (e.g., #7F5733)."
    },
    {
        id: 2,
        text: "Each two-digit pair in a hex code represents the intensity of red, green, or blue."
    },
    {
        id: 3,
        text: "The color of the tiles will change to show how close your guess was to the target color."
    }
]

export const examples: Example[] = [
    {
        id: 1,
        hex: "7F5733",
        characters: [
            {
                character: "7",
                color: "red",
                status: "match"
            },
            {
                character: "F"
            },
            {
                character: "5"
            },
            {
                character: "7"
            },
            {
                character: "3"
            },
            {
                character: "3"
            }
        ],
        character: "7",
        description: "matches the red value of the target color."
    },
    {
        id: 2,
        hex: "FF5733",
        characters: [
            {
                character: "f",
                color: "red",
                status: "high"
            },
            {
                character: "f"
            },
            {
                character: "5"
            },
            {
                character: "7"
            },
            {
                character: "3"
            },
            {
                character: "3"
            }
        ],
        character: "F",
        description: "is higher than the red value in the target color."
    },
    {
        id: 3,
        hex: "0F5733",
        characters: [
            {
                character: "0",
                color: "red",
                status: "low"
            },
            {
                character: "F"
            },
            {
                character: "5"
            },
            {
                character: "7"
            },
            {
                character: "3"
            },
            {
                character: "3"
            }
        ],
        character: "0",
        description: "is lower than the red value in the target color."
    }
]

export const defaultGameState: StoredGameState = {
    boardState: [],
    hardMode: false,
    darkMode: false,
    status: null
}

export const defaultGameStats: GameStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guesses: {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0
    },
    currentRow: null
}

export const GAME_STATUSES = {
    IN_PROGRESS: 'in_progress',
    WON: 'won',
    LOST: 'lost'
} as const

export const feedbackWords: { [key: number]: string[] } = {
    1: ["Genius", "Flawless", "Unreal", "Mastermind", "W"],
    2: ["Sharp", "Impressive", "Skilled", "Focused"],
    3: ["Sharp", "Impressive", "Skilled", "Focused"],
    4: ["Solid", "Nice", "Clean", "Steady"],
    5: ["Solid", "Nice", "Clean", "Steady"],
    6: ["Clutch", "Lucky", "Barely", "Saved", "Phew"]
};

export const VIEWS: ViewsMap = {
    SIGN_IN: 'sign_in',
    SIGN_UP: 'sign_up',
    FORGOTTEN_PASSWORD: 'forgotten_password',
    MAGIC_LINK: 'magic_link',
    UPDATE_PASSWORD: 'update_password',
} as const;