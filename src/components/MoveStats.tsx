import React from 'react'
import styles from '../styles/MoveStats.module.css'

interface Props{
  numMovesInDB:number
  numGamesInDB:number
}

export default function MoveStats(props:Props) {

  return (
    <div className={styles.container}>
      <p>{`${props.numGamesInDB} games in database`}</p>
      <p>{`${props.numMovesInDB} possible moves in database`}</p>
    </div>
    
  )
}
