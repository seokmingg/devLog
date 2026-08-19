import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout/AppLayout'
import { Login } from '../pages/Login/Login'
import { Main } from '../pages/Main/Main'
import {OAuthCallback} from '../pages/OAuthCallback/OAuthCallback.tsx'
import {Signup} from "../pages/Signup/Signup.tsx";
import {ProtectedRoute} from './ProtectedRoute.tsx'
import {GuestRoute} from './GuestRoute.tsx'
import {MyPage} from '../pages/MyPage/MyPage.tsx'
import {PostWrite} from '../pages/PostWrite/PostWrite.tsx'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute/>}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Main />} />
            <Route path="/mypage" element={<MyPage/>}/>
            <Route path="/posts/new" element={<PostWrite/>}/>
            <Route path="/posts/:postId/edit" element={<PostWrite/>}/>
          </Route>
        </Route>
        <Route element={<GuestRoute/>}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup/>}/>
        </Route>
        <Route path="/oauth/callback" element={<OAuthCallback />} />
      </Routes>
    </BrowserRouter>
  )
}
