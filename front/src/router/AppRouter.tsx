import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout/AppLayout'
import { Login } from '../pages/Login/Login'
import { Main } from '../pages/Main/Main'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Main />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}
