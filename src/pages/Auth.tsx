import { Header, Footer } from "@/components"
import { useParams, Navigate } from "react-router"
import { useSession } from '@/context/AuthContext';
import { VIEWS } from "@/constants";
import { useState, useEffect } from "react";
import type { ViewType } from '@/types'
import { supabaseClient } from '@/lib/supabase'
import { EmailAuth } from "@/features/auth/EmailAuth";

const Layout = ({ children }: { children: React.ReactNode}) => {
    return (
        <div className="flex flex-col h-screen">
            <Header />
            {children}
            <Footer />
        </div>
    )
}

export const Auth = () => {
    const { session } = useSession();
    const { view } = useParams()
    const [authView, setAuthView] = useState<ViewType>(VIEWS.SIGN_IN);

    useEffect(() => {
        console.log("authView", authView)
        setAuthView(view as ViewType);
    }, [view])

    if (session) return <Navigate to="/" />;

    switch(authView) {
        case VIEWS.SIGN_IN:
            return (
                <Layout>
                    <EmailAuth authView={authView} supabaseClient={supabaseClient} />
                </Layout>
            )
        case VIEWS.SIGN_UP:
            return (
                <Layout>
                    <EmailAuth authView={authView} supabaseClient={supabaseClient} />
                </Layout>
            )
        default:
            return null
    }
}
