import { useEffect, useState } from 'react'

import { Routes,Route,Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'


import './App.css'
import { useThemeStore } from './store/useThemeStore.js'
import { useAuthStore } from './store/useAuthStore.js'

function App() {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers}=useAuthStore();
  const {theme}=useThemeStore()
  console.log({onlineUsers})
  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  

  if(isCheckingAuth&&!authUser) return(
    <div className='flex items-center justify-center h-screen'>
      <Loader className='size-10 animate-spin'/>
    </div>
  )

  return (
    <>
      <div data-theme={theme}>
        <Navbar/>
        <Routes>
          <Route path='/' element={authUser?<HomePage/>:<Navigate to="/login"/>}/>
          <Route path='/signup' element={!authUser?<SignUpPage/>:<Navigate to="/"/>}></Route>
          <Route path='/login' element={!authUser?<LoginPage/>:<Navigate to="/"/>}></Route>
          <Route path='/settings' element={<SettingsPage/>}></Route>
          <Route path='/profile' element={authUser?<ProfilePage/>:<Navigate to="/login"/>}></Route>
        </Routes>
        <Toaster/>
      </div>
      
    </>
  )
}

export default App
