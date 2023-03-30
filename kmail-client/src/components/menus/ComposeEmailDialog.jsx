import React, { useContext, useState } from 'react'
import { DarkModeContext } from '../../context/DarkThemeContext'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState } from 'draft-js'

import muiStyles from '../../styles/muiStyles'
const { Paper, Typography, IconButton, TextField, CloseIcon } = muiStyles

const ComposeEmailDialog = ({setShowComposeDialog}) => {
  const { DarkTheme } = useContext(DarkModeContext)
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  )

  function handleEditorStateChange(newState) {
    setEditorState(newState)
  }

  return (
    <Paper elevation={5} className="compose-email-dialog">
      <div className="compose-email-header">
        <Typography variant="subtitle" fontSize={15}>
          New Message
        </Typography>
        <div>
          <IconButton onClick={() => setShowComposeDialog(false)}>
            <CloseIcon htmlColor="black" sx={{ fontSize: '20px' }} />
          </IconButton>
        </div>
      </div>
      <div className="compose-header-input-wrapper">
        <Typography
          variant="subtitle"
          style={{ opacity: 0.75, fontSize: '15px' }}
        >
          To
        </Typography>
        <input className="compose-header-inputs" />
      </div>
      <div className="compose-header-input-wrapper">
        {/* <Typography
          variant="subtitle"
          style={{ opacity: 0.75, fontSize: '14px' }}
        >
          Subject
        </Typography> */}
        <input placeholder='Subject' className="compose-header-inputs" />
      </div>
      <div className='editor-wrapper'>
        <Editor
          editorState={editorState}
          onEditorStateChange={handleEditorStateChange}
        />
      </div>
      <div>

      </div>
    </Paper>
  )
}

export default ComposeEmailDialog
