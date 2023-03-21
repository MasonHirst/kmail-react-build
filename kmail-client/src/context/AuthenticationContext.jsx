import React, { createContext, useState, useEffect, useContext } from 'react'
import AllMenus from '../components/menus/AllMenus'
import Login from '../components/auth/Login'
import { DarkModeContext } from './DarkThemeContext'
import AllAuth from '../components/menus/AllMenus'
import { Routes, Route, Navigate } from 'react-router-dom'
import Koogle_logo from '../assets/Koogle.svg'
import loading_snail from '../assets/loading-snail-gif.png'
import axios from 'axios'
import LoadingScreen from '../components/asset-components/LoadingScreen'

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
  const { darkTheme } = useContext(DarkModeContext)
  const [user, setUser] = useState()
  const [isDeepLoading, setIsDeepLoading] = useState(false)
  const [isLightLoading, setIsLightLoading] = useState(false)
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
          // console.log('res: ', data.data)
          setUser(data.data)
        } else {
          setTimeout(() => {
            setAuthState(NOT_AUTHENTICATED)
          }, 1000);
        }
      } catch (error) {
        console.error('you got an error bro', error)
      }
    })()
  }, [])

  useEffect(() => {
    if (user && accessToken) {
      setTimeout(() => {
        setAuthState(AUTHENTICATED)
      }, 1000);
    }
  }, [user, accessToken])

  // console.log({authState})

  if (authState === LOADING) {
    return (
      <LoadingScreen />
    )
  }

  return (
    <AuthContext.Provider value={{ user, authState, setUser, logout, children, accessToken, isLightLoading, setIsLightLoading, setAccessToken, isDeepLoading, setIsDeepLoading }}>
      {/* {authState !== AUTHENTICATED ? (children) : (
        <Routes>
          <Route path='authenticate' element={<AllAuth />} />
          <Route path='authenticate' element={<Login />} />
        </Routes>
      )} */}
      {children}
    </AuthContext.Provider>
  )
}
