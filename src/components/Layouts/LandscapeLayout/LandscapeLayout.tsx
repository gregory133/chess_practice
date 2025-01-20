import React from 'react'
import Navbar from '../../Navbar/Navbar'
import Board from '../../Board/Board'
import EvalBar from '../../EvalBar/EvalBar'
import MaterialCount from '../../EvalBar/MaterialCount/MaterialCount'
import Sidebar from '../../Sidebar/Sidebar'
import StockfishComponent from '../../Stockfish/StockfishComponent'
import styles from './LandscapeLayout.module.scss'
import Winrate from '../../../classes/Winrate'
import WinrateBar from '../../Sidebar/WinrateBar/WinrateBar'
import MovesBar from '../../MovesBar/MovesBar'

export default function LandscapeLayout() {
  return (
    <div className={styles.main}>
      <Navbar mainStyles={{gridColumn: 'span 4'}}/>
      <MovesBar/>
      <Board/>
      <EvalBar/>
      <Sidebar/> 
      <StockfishComponent/>
    </div>
  )
}
