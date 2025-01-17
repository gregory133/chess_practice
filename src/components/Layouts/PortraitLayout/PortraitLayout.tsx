import React from 'react'
import styles from './PortraitLayout.module.scss'
import Navbar from '../../Navbar/Navbar'
import Board from '../../Board/Board'
import SidebarPortrait from '../../SidebarPortrait/SidebarPortrait'
import EvalBar from '../../EvalBar/EvalBar'


export default function PortraitLayout() {
  return (
    <div className={styles.main}>
      <Navbar/>
      <div className={styles.boardContainer}>
        <Board/>
        <EvalBar/> 
      </div>
     
      <SidebarPortrait/>
    </div>
  )
}
