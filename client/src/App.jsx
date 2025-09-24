import React, { lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectRoute from './components/auth/ProtectRoute'
import AppLayout from './components/layout/AppLayout'
import { Suspense } from 'react'
import Loader from './components/layout/Loader'
import axios from 'axios'
import { server } from './components/constants/config'
import { useDispatch, useSelector } from 'react-redux'
import { userExists, userNotExists } from './redux/reducers/auth'
import { Toaster } from 'react-hot-toast'
// import './index.css'

const Home = lazy(() => import("./pages/Home"))
const Login = lazy(() => import("./pages/Login"))
const Chat = lazy(() => import("./pages/Chat"))
const Groups = lazy(() => import("./pages/Groups"))
const NotFound = lazy(() => import("./pages/NotFound"))
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"))
const Dashboard = lazy(() => import("./pages/admin/Dashboard"))
const UserManagement = lazy(() => import("./pages/admin/UserManagement"))
const MessageManagement = lazy(() => import("./pages/admin/MessageManagement"))
const ChatManagement = lazy(() => import("./pages/admin/ChatManagement"))

// let user = true

const App = () => {
  // console.log(server)
  const { user, loader } = useSelector(state => state.auth)
  const dispatch = useDispatch();

  useEffect(() => {

    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch((err) => dispatch(userNotExists()))
  }, [dispatch])

  const HomeWithLayOut = AppLayout()(Home)
  const ChatWithLayOut = AppLayout()(Chat)

  return loader ? (
    <Loader />
  ) : (<BrowserRouter>
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

        <Route path='/admin' element={<AdminLogin />} />
        <Route path='/admin/dashboard' element={<Dashboard />} />
        <Route path='/admin/users' element={<UserManagement />} />
        <Route path='/admin/messages' element={<MessageManagement />} />
        <Route path='/admin/chats' element={<ChatManagement />} />




        <Route path='*' element={<NotFound />} />

      </Routes>
    </Suspense>
    <Toaster position='bottom-center' />
  </BrowserRouter>)
}

export default App