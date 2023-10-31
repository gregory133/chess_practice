import React from 'react'
import styles from '../styles/Sidebar.module.css'
import WinrateBar from './WinrateBar'
import Winrate from '../classes/Winrate'
import MoveStats from './MoveStats'

interface Props{
  openingName:string
  winrate: Winrate|null
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
      <MoveStats numGamesInDB={700} numMovesInDB={8}/>
      
    </div>
  )
}
