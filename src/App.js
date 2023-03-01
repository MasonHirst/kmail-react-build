import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AllMenus from './components/menus/AllMenus'
import AllAuth from './components/auth/AllAuth'
import './reset.css'


function App() {

  return (
    <div
      className="App"
      style={{
        minHeight: '100vh',
      }}
    >
      <Routes>
        <Route path='/' element={<AllMenus />} />
        <Route path='authenticate' element={<AllAuth />} />
      </Routes>
    </div>
  )
}

export default App
