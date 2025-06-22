import { React, useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import AssistantSelect from './pages/AssistantSelect'
import UpdateName from './pages/UpdateName'
import useAuthStore from './store/useAuthStore'
import { Toaster } from 'react-hot-toast'
import { Loader } from "lucide-react";
import Home from './pages/Home'
const App = () => {

  const { authUser, isCheckingAuth, checkAuth } = useAuthStore()
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <>
      <Routes>
        <Route path="/assistant_select" element={authUser ? <AssistantSelect /> :<Navigate to="/signin" /> } />
        <Route path="/update_name" element={authUser ? <UpdateName /> : <Navigate to="/signin" /> } />
        <Route path="/signup" element={!authUser ? <Signup /> : <Home/>} />
        <Route path='/signin' element={!authUser ?<Signin /> : <Home/>} />
        <Route path='/' element={authUser ? <Home /> : <Navigate to="/signin" />} />
      </Routes>
      <Toaster />
    </>
  )
}
export default App