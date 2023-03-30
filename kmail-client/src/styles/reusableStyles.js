import React from 'react'
import muiStyles from './muiStyles'
const { Paper } = muiStyles

export function PopupModal({ children }) {
  return (
    <Paper elevation={3} style={{
      padding: '15px',
      borderRadius: '10px !important',
      position: 'fixed',
      top: '55px',
      right: '15px',
      zIndex: '5',
      minWidth: '150px',
      minHeight: '120px',
    }}>
      {children}
    </Paper>
  )
}
