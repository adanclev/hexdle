import {Route, Routes} from "react-router";
import {MainPage} from "@/pages/MainPage";
import {Auth} from "@/pages/Auth";
import {EmailAuth} from "@/features/auth/EmailAuth.tsx";

function App() {
  return (
      <Routes>
        <Route index element={<MainPage />} />
        {/*<Route path='/auth/:view' element={<Auth />} />*/}
          <Route path='/auth' element={<Auth />}>
              <Route path=':view' element={<EmailAuth />} />
          </Route>
      </Routes>
  )
}

export default App