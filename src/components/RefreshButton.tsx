import React, { useState } from 'react'
import RefreshIcon from '@mui/icons-material/Refresh';
import styles from '../styles/RefreshButton.module.css'

export default function RefreshButton() {

  const NOT_HOVERED_COLOR= '#302E2C'
  const HOVERED_COLOR = '#484643'
  const [bgColor, setBgColor]=useState<string>(NOT_HOVERED_COLOR)

  function onClick(){
    console.log('override onclick');
  }

  return (
    <div onClick={onClick} title='Reset Board' 
    onMouseEnter={()=>setBgColor(HOVERED_COLOR)} 
    onMouseLeave={()=>setBgColor(NOT_HOVERED_COLOR)}
    style={{backgroundColor: bgColor}} className={styles.container}>
      <RefreshIcon style={{color: 'white'}}/>
    </div>
  )
}
