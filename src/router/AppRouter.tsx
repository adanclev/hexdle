import { MainPage } from '@/pages/MainPage'
import { Auth } from '@/pages/Auth.tsx'
import { Routes, Route } from 'react-router'

export const AppRouter = () => {
    return (
        <Routes>
            <Route index element={<MainPage />} />
            <Route path='/auth/:view' element={<Auth />} />
        </Routes>
    )
}
