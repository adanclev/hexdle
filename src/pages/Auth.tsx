import { Header, Footer } from "@/components"
import { Navigate, Outlet } from "react-router"
import { useSession } from '@/context/AuthContext';

export const Auth = () => {
    const { session } = useSession();

    if (session) return <Navigate to="/" replace />;

    return (
        <div className="flex flex-col h-screen">
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
}
