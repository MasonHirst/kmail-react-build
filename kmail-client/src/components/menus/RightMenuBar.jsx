import React, { useState } from 'react'

import muiStyles from '../../styles/muiStyles'
const { Box, IconButton, AddIcon, KeyboardArrowRightIcon, ChevronLeftIcon } =
  muiStyles

const RightMenuBar = () => {
  const [showIconBar, setShowIconBar] = useState(true)

  return (
    <div>
      {showIconBar ? (
        <Box className="right-icon-btns-bar">
          <IconButton>
            <img
              alt="calendar logo"
              width={20}
              src="https://www.gstatic.com/companion/icon_assets/calendar_2020q4_2x.png"
            />
          </IconButton>
          <IconButton>
            <img
              alt="keep notes logo"
              width={20}
              src="https://www.gstatic.com/companion/icon_assets/keep_2020q4v3_2x.png"
            />
          </IconButton>
          <IconButton>
            <img
              alt="tasks logo"
              width={20}
              src="https://www.gstatic.com/companion/icon_assets/tasks_2021_2x.png"
            />
          </IconButton>
          <IconButton>
            <img
              alt="contacts logo"
              width={20}
              src="https://www.gstatic.com/companion/icon_assets/contacts_2022_2x.png"
            />
          </IconButton>
          <div className="line-divider-div" />
          <IconButton>
            <AddIcon />
          </IconButton>

          <IconButton
            onClick={() => setShowIconBar(!showIconBar)}
            className="hide-iconbar-btn"
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        </Box>
      ) : (
        <Box className="hidden-icon-bar">
          <div
            onClick={() => setShowIconBar(!showIconBar)}
            className="show-iconbar-btn"
          >
            <ChevronLeftIcon />
          </div>
        </Box>
      )}
    </div>
  )
}

export default RightMenuBar
