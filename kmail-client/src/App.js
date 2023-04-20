import React, { useContext, useEffect } from 'react'
// eslint-disable-next-line
import { Routes, Route, Navigate } from 'react-router-dom'
import AllMenus from './components/menus/AllMenus'
import AllAuth from './components/auth/AllAuth'
import { AuthContext } from './context/AuthenticationContext'
import './reset.css'
import { SocketProvider } from './context/SocketContext'

function App() {
  const { authState } = useContext(AuthContext)

  return (
    <div
      className="App"
      style={{
        minHeight: '100vh',
      }}
    >
      {authState === 'AUTHENTICATED' ? (
        <SocketProvider>
          <Routes>
            <Route path="/*" element={<AllMenus />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </SocketProvider>
      ) : (
        <Routes>
          <Route path="authenticate/*" element={<AllAuth />} />
          <Route path="*" element={<Navigate to="authenticate" />} />
        </Routes>
      )}
    </div>
  )
}

export default App
