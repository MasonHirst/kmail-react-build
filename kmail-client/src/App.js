import React from 'react'
// eslint-disable-next-line
import { Routes, Route, Navigate } from 'react-router-dom'
import AllMenus from './components/menus/AllMenus'
import AllAuth from './components/auth/AllAuth'

import { Authentication } from './context/AuthenticationContext'
import './reset.css'

function App() {
  return (
    <Authentication>
      <div
        className="App"
        style={{
          minHeight: '100vh',
        }}
      >
        <Routes>
          {/* <Route path="authenticate/*" element={<AllAuth />} /> */}
          <Route path="/" element={<AllMenus />} />
          <Route path='*' element={<Navigate to={'/'} />} />
        </Routes>
      </div>
    </Authentication>
  )
}

export default App
