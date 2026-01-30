import {createContext, useContext, useEffect, useState} from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabaseClient } from '@/lib/supabase'

interface AuthContextType {
    user: User | null,
    session: Session | null,
    loading: boolean,
    signInWithGoogle: () => Promise<void>
    signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useSession = () => {
    const context = useContext(AuthContext);
    console.log('useSession', context);
    if (!context) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
}

type Props = { children : React.ReactNode };
export const AuthProvider = ({ children }: Props) => {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        // Checar sesión activa al inicio
        supabaseClient.auth.getSession()
            .then(({ data: { session } }) => {
                setSession(session)
                setUser(session?.user ?? null)
                setLoading(true)
            })

        console.log(session)

        // Escuchar cambios (login, logout, token refresh)
        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    },[supabaseClient])

    const signInWithGoogle = async () => {
        await supabaseClient.auth.signInWithOAuth({ provider: 'google' })
    }

    const signOut = async () => {
        await supabaseClient.auth.signOut()
    }

    return (
        <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signOut }}>
            {loading ? <p>Loading...</p> : children}
        </AuthContext.Provider>
    )
}