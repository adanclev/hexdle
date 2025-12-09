import { MainPage } from '@/pages/MainPage'
import { SignIn } from "@/features/auth/SignIn"
import { Routes, Route } from 'react-router'

export const AppRouter = () => {
    return (
        <Routes>
            <Route path='/' element={<MainPage />} />
            <Route path='/log' element={<SignIn />} />
        </Routes>
    )
}
