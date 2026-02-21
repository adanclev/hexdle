import {createContext, useContext, useEffect, useState} from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabaseClient } from '@/lib/supabase';
import type {UserPreferences, UserWithPreferences} from "@/features/auth/types";
import {getUserPreferences, syncUserPrefs} from "@/features/auth/services/auth.service";

interface AuthContextType {
    user: UserWithPreferences | null,
    session: Session | null,
    authLoading: boolean,
    updateUserPrefs: (prefs: UserPreferences) => Promise<void>,
    signInWithGoogle: () => Promise<void>,
    signOut: () => Promise<void>,
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useSession = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
}

type Props = { children : React.ReactNode };
export const AuthProvider = ({ children }: Props) => {
    const [user, setUser] = useState<UserWithPreferences | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [authLoading, setAuthLoading] = useState<boolean>(true)

    useEffect(() => {
        // Escuchar cambios (login, logout, token refresh)
        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                setSession(null);
                setUser(null);
                setAuthLoading(false);
                return;
            }

            if (session) {
                setSession(session);
                return;
            }

            setSession(null);
            setUser(null);
            setAuthLoading(false);
        })

        return () => subscription.unsubscribe()
    }, [])

    useEffect(() => {
        if (!session) return;

        const loadUserPrefs = async () => {
            setAuthLoading(true);
            try {
                const result = await getUserPreferences(session);

                if (result) {
                    setUser({ ...session.user, preferences: {...result} })
                } else {
                    setUser({ ...session.user, preferences: { darkMode: false, hardMode: false }})
                }
            } catch (err) {
                console.error("[Supabase Error]:", err)
            } finally {
                setAuthLoading(false);
            }
        }
        loadUserPrefs();
    }, [session?.user?.id]);

    const signInWithGoogle = async () => {
        await supabaseClient.auth.signInWithOAuth({ provider: 'google' })
    }

    const signOut = async () => {
        setAuthLoading(true);
        await supabaseClient.auth.signOut()
    }

    const updateUserPrefs = async (
        prefs: UserPreferences,
    ): Promise<void> => {
        if (!user) return;

        const newUser: UserWithPreferences = {
            ...user,
            preferences: prefs
        };

        setUser(newUser);
        await syncUserPrefs(newUser);
    }

    return (
        <AuthContext.Provider value={{ user, session, authLoading, updateUserPrefs, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}