import React, { useState } from 'react'
import RefreshIcon from '@mui/icons-material/Refresh';
import styles from '../styles/RefreshButton.module.css'
import { useChessStore } from '../stores/chessStore';

export default function RefreshButton() {

  const reset=useChessStore(state=>state.reset)
  const NOT_HOVERED_COLOR= '#302E2C'
  const HOVERED_COLOR = '#484643'
  const [bgColor, setBgColor]=useState<string>(NOT_HOVERED_COLOR)

  function resetState(){
    reset()
  }

  function onClick(){
    resetState()
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
