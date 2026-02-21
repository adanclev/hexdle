import type {Digit} from "@/types";
import type {User} from "@supabase/supabase-js";

export type StrengthBarDigits = Record<Digit, string>;

export interface UserPreferences {
    darkMode: boolean,
    hardMode: boolean,
}

export interface UserWithPreferences extends User {
    preferences: UserPreferences,
}