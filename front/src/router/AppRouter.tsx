import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout/AppLayout'
import { Login } from '../pages/Login/Login'
import { Main } from '../pages/Main/Main'
import {OAuthCallback} from '../pages/OAuthCallback/OAuthCallback.tsx'
import {Signup} from "../pages/Signup/Signup.tsx";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Main />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path={"/signup"} element={<Signup/>}/>
      </Routes>
    </BrowserRouter>
  )
}
