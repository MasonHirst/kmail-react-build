import React, { useContext } from 'react'
import Koogle_logo from '../../assets/Koogle.svg'
import loading_snail from '../../assets/loading-snail-gif.png'
import { DarkModeContext } from '../../context/DarkThemeContext'

const LoadingScreen = () => {
  const { darkTheme } = useContext(DarkModeContext)
  
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: `${darkTheme ? 'black' : 'white'}`,
      }}
    >
      <img
        src={Koogle_logo}
        alt="Koogle logo"
        style={{ width: 'clamp(150px, 20vw, 400px)' }}
      />
      <img
        src={loading_snail}
        style={{ width: 'clamp(150px, 40vw, 600px)' }}
        alt="loading"
      />
    </div>
  )
}

export default LoadingScreen
