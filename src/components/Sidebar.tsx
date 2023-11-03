import React from 'react'
import styles from '../styles/Sidebar.module.css'
import WinrateBar from './WinrateBar'
import Winrate from '../classes/Winrate'
import MoveStats from './MoveStats'
import SetFen from './SetFen'
import RefreshButton from './RefreshButton'
import { useChessStore } from '../stores/chessStore'
import ColorSelect from './ColorSelect'
import DatabaseSelect from './DatabaseSelect'


export default function Sidebar() {

  const openingName=useChessStore(state=>state.openingName)
  const winrate=useChessStore(state=>state.winrate)
  const numGamesInDB=useChessStore(state=>state.numGamesInDB)
  const numMovesInDB=useChessStore(state=>state.numMovesInDB)

  return (
    <div className={styles.sidebar}>
      <p className={styles.openingName}>{openingName}</p>
      <div className={styles.winrateBarContainer}>
        {
          winrate ? <WinrateBar winrate={winrate}/> : null
        }
      </div>
      {
        (numGamesInDB && numMovesInDB) 
          ? (<MoveStats numGamesInDB={numGamesInDB} 
          numMovesInDB={numMovesInDB}/>)
          : null
      }
      <SetFen/>
      <ColorSelect/>
      <DatabaseSelect/>
    </div>
  )
}
