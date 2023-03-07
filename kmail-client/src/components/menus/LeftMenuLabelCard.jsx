import React, {  } from 'react'
import muiStyles from '../../styles/muiStyles.js'
const {
  LabelIcon,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} = muiStyles

const LeftMenuLabelCard = ({ labelName }) => {
  return (
    <div className="rounded-right menu-label-card">
      <ListItemButton className="rounded-right">
        <ListItemIcon>
          <LabelIcon />
        </ListItemIcon>
        <ListItemText className='text' primary={labelName} />
      </ListItemButton>
    </div>
  )
}

export default LeftMenuLabelCard
