import React, { useState } from 'react'
import styles from './Reset.module.scss'
import { useChessStore } from '../../../stores/chessStore'

export default function () {

  const COLOR_HOVERED = '#706F6D'
  const COLOR_UNHOVERED = 'transparent'
  const [color, setColor] = useState(COLOR_UNHOVERED)

  const reset = useChessStore(state=>state.reset)

  function onClickReset(){
    reset()
  }

  return (
    <div className={styles.main}>
        <span className={styles.resetText}>Reset Position:</span> 
        <div onClick={onClickReset}
        onMouseEnter={()=>setColor(COLOR_HOVERED)} onMouseLeave={()=>setColor(COLOR_UNHOVERED)} style={{
        backgroundColor: color
        }} className={styles.refreshContainer}>
            <div style={{backgroundImage: `url('${process.env.PUBLIC_URL}/images/reset.png')`}} 
            className={styles.refreshImage}/>
        </div>
    </div>
  )
}
