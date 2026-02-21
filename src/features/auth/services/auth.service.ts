import type {Session} from "@supabase/supabase-js";
import {supabaseClient} from "@/lib/supabase.ts";
import type {UserPreferences, UserWithPreferences} from "@/features/auth/types";
import type {LoginFormData, RegisterFormData} from "@/features/auth/utils/validation";

export async function getUserPreferences (session: Session): Promise<UserPreferences> {
    const { data, error } = await supabaseClient
        .from("user_prefs")
        .select("dark_mode, hard_mode")
        .eq("user_id", session.user.id)
        .single()

    if (error) throw error

    return {
        darkMode: data.dark_mode,
        hardMode: data.hard_mode,
    }
}

export async function syncUserPrefs (
    user: UserWithPreferences,
): Promise<UserPreferences | null> {
    const { id, preferences } = user;

    if (!preferences) {
        console.error("[Save Error]: Mising information", { preferences });
        return null;
    }

    const { data, error } = await supabaseClient
        .from('user_prefs')
        .update({
            dark_mode: preferences.darkMode,
            hard_mode: preferences.hardMode,
        })
        .eq('user_id', id)
        .select('dark_mode, hard_mode')
        .single();

    if (error) {
        console.error("[Supabase Error]:", error.message);
        return null;
    }

    return {
        darkMode: data.dark_mode,
        hardMode: data.hard_mode
    };
}

export async function registerWithEmail(
    registerData: RegisterFormData,
) {
    const {data, error} =
        await supabaseClient.auth.signUp({
            email: registerData.email,
            password: registerData.password,
            options: {
                data: {display_name: registerData.name},
            },
        })

    return { data, error };
}

export async function signInWithPassword(
    data: LoginFormData,
) {
    const {error} = await supabaseClient.auth.signInWithPassword({
        email: data.email,
        password: data.password,
    })

    return { error };
}
