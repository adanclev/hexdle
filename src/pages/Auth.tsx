import { Header, Footer } from "@/components"
import {Navigate, Outlet, useParams} from "react-router"
import { useSession } from '@/context/AuthContext';
import type {ViewType} from "@/types";
import {NotFound} from "@/pages/NotFound.tsx";
import {VIEWS} from "@/constants.ts";

export const Auth = () => {
    const { session } = useSession();
    const { view } = useParams();

    const isViewType = (view: ViewType): boolean => {
        return Object.values(VIEWS).includes(view);
    }

    if (session) return <Navigate to="/" replace />;

    if (!isViewType(view as ViewType)) return <NotFound />;

    return (
        <div className="flex flex-col h-screen">
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
}
