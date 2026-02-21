import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { GameStateProvider } from './context/GameContext'
import { AuthProvider } from "@/context/AuthContext";

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
      <AuthProvider>
        <GameStateProvider>
            <App />
        </GameStateProvider>
      </AuthProvider>
  </BrowserRouter>
)
