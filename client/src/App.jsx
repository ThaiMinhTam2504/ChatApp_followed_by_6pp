import React, { lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectRoute from './components/auth/ProtectRoute'
import AppLayout from './components/layout/AppLayout'
import { Suspense } from 'react'
import Loader from './components/layout/Loader'
// import './index.css'

const Home = lazy(() => import("./pages/Home"))
const Login = lazy(() => import("./pages/Login"))
const Chat = lazy(() => import("./pages/Chat"))
const Groups = lazy(() => import("./pages/Groups"))
const NotFound = lazy(() => import("./pages/NotFound"))



let user = true

const App = () => {
  const HomeWithLayOut = AppLayout()(Home)
  const ChatWithLayOut = AppLayout()(Chat)

  return <BrowserRouter>
    <Suspense fallback={<Loader />}>
      <Routes>

        <Route element={<ProtectRoute user={user} />}>
          <Route path='/' element={<HomeWithLayOut />} />
          <Route path='/chat/:chatId' element={<ChatWithLayOut />} />
          <Route path='/groups' element={<Groups />} />
        </Route>

        <Route path='/login' element={<ProtectRoute user={!user} redirect='/'>
          <Login />
        </ProtectRoute>} />

        <Route path='*' element={<NotFound />} />

      </Routes>
    </Suspense>
  </BrowserRouter>
}

export default App