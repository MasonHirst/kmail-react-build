import React, { createContext, useState, useEffect } from 'react'
import { getUser } from '../data'
import AllAuth from '../components/menus/AllMenus'
import { Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'

export const AuthContext = createContext()

const initialUser = {
  id: null,
  username: 'jonny',
}

const tokenKey = 'jwtAccessToken'
const LOADING = 'LOADING'
const AUTHENTICATED = 'AUTHENTICATED'
const NOT_AUTHENTICATED = 'NOT_AUTHENTICATED'

export function Authentication({ children }) {
  const [user, setUser] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [accessToken, setAccessToken] = useState()
  const [authState, setAuthState] = useState(LOADING)

  function logout() {
    localStorage.removeItem(tokenKey)
    setAccessToken(undefined)
    setUser(undefined)
    setAuthState(NOT_AUTHENTICATED)
    window.location.reload(false)
  }

  useEffect(() => {
    ;(async () => {
      try {
        const token = localStorage.getItem(tokenKey)
        if (token) {
          setAccessToken(token)
          const data = await axios.get(`/accounts/users`)
          setUser(data)
        } else {
          setAuthState(NOT_AUTHENTICATED)
        }
      } catch (error) {
        console.error('you got an error bro', error)
      }
    })()
  }, [])

  useEffect(() => {
    if (user && accessToken) setAuthState(AUTHENTICATED)
  }, [user, accessToken])
  console.log({authState});

  return (
    <AuthContext.Provider value={{ user, setUser, logout, children, accessToken, setAccessToken, isLoading, setIsLoading }}>
      {authState === AUTHENTICATED ? (children) : (
        <Routes>
          <Route path='authenticate/*' element={<AllAuth />} />
        </Routes>
      )}
      {/* {children} */}
    </AuthContext.Provider>
  )
}
