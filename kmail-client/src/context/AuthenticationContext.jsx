import React, { createContext, useState, useEffect, useContext } from 'react'
import { DarkModeContext } from './DarkThemeContext'
import axios from 'axios'
import LoadingScreen from '../components/asset-components/LoadingScreen'

export const AuthContext = createContext()

const tokenKey = 'jwtAccessToken'
const LOADING = 'LOADING'
const AUTHENTICATED = 'AUTHENTICATED'
const NOT_AUTHENTICATED = 'NOT_AUTHENTICATED'

export function Authentication({ children }) {
  const { darkTheme } = useContext(DarkModeContext)
  const [user, setUser] = useState()
  const [chatId, setChatId] = useState('')
  const [isDeepLoading, setIsDeepLoading] = useState(false)
  const [isLightLoading, setIsLightLoading] = useState(false)
  const [accessToken, setAccessToken] = useState()
  const [authState, setAuthState] = useState(LOADING)
  const [updateMessages, setUpdateMessages] = useState(false)

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
          }, 500);
        }
      } catch (error) {
        alert('Something went wrong. Please login again')
        localStorage.removeItem('jwtAccessToken')
        window.location.reload();
        console.error('you got an error bro', error)
      }
    })()
  }, [])

  useEffect(() => {
    if (user && accessToken) {
      setTimeout(() => {
        setAuthState(AUTHENTICATED)
      }, 500);
    }
  }, [user, accessToken])

  // console.log({authState})

  if (authState === LOADING) {
    return (
      <LoadingScreen />
    )
  }

  return (
    <AuthContext.Provider value={{ user, updateMessages, setUpdateMessages, chatId, setChatId, authState, setUser, logout, children, accessToken, isLightLoading, setIsLightLoading, setAccessToken, isDeepLoading, setIsDeepLoading }}>
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
