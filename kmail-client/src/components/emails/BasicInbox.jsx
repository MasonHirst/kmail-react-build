import React, { useEffect } from 'react'

const BasicInbox = () => {

  useEffect(() => {
    document.title = 'Kmail - inbox'
    return () => {
      document.title = 'Kmail'
    }
  }, [])
  
  return (
    <div className='emails-page-div-general'>BasicInbox</div>
  )
}

export default BasicInbox