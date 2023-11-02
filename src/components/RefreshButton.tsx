import React, { useState } from 'react'
import RefreshIcon from '@mui/icons-material/Refresh';
import styles from '../styles/RefreshButton.module.css'

interface Props{
  onClick:(params?:any)=>void
}

export default function RefreshButton(props:Props) {

  const NOT_HOVERED_COLOR= '#302E2C'
  const HOVERED_COLOR = '#484643'
  const [bgColor, setBgColor]=useState<string>(NOT_HOVERED_COLOR)

  return (
    <div onClick={props.onClick} title='Reset Board' 
    onMouseEnter={()=>setBgColor(HOVERED_COLOR)} 
    onMouseLeave={()=>setBgColor(NOT_HOVERED_COLOR)}
    style={{backgroundColor: bgColor}} className={styles.container}>
      <RefreshIcon style={{color: 'white'}}/>
    </div>
  )
}
