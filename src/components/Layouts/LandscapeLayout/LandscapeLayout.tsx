import React from 'react'
import Navbar from '../../Navbar/Navbar'
import Board from '../../Board/Board'
import EvalBar from '../../EvalBar/EvalBar'
import MaterialCount from '../../EvalBar/MaterialCount/MaterialCount'
import Sidebar from '../../Sidebar/Sidebar'
import StockfishComponent from '../../Stockfish/StockfishComponent'
import styles from './LandscapeLayout.module.scss'

//TODO: add left bar for something (e.g moves)

export default function LandscapeLayout() {
  return (
    <div className={styles.main}>
      <Navbar mainStyles={{gridColumn: 'span 3'}}/>
      <div className={styles.something}></div>
      <Board/>
      <Sidebar/> 
    </div>
  )
}
