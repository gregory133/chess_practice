import React from 'react'
import styles from '../styles/Sidebar.module.css'
import WinrateBar from './WinrateBar'
import Winrate from '../classes/Winrate'
import MoveStats from './MoveStats'
import SetFen from './SetFen'
import RefreshButton from './RefreshButton'

interface Props{
  openingName:string
  winrate: Winrate|null
  numGamesInDB: number|null
  numMovesInDB: number|null
  setStartingFen: (fen:string)=>void
}

export default function Sidebar(props:Props) {

  return (
    <div className={styles.sidebar}>
      <p className={styles.openingName}>{props.openingName}</p>
      <div className={styles.winrateBarContainer}>
        {
          props.winrate ? <WinrateBar winrate={props.winrate}/> : null
        }
      </div>
      {
        (props.numGamesInDB && props.numMovesInDB) 
          ? (<MoveStats numGamesInDB={props.numGamesInDB} 
          numMovesInDB={props.numMovesInDB}/>)
          : null
      }
      <SetFen setStartingFen={props.setStartingFen}/>
    </div>
  )
}
