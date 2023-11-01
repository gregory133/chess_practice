import React from 'react'
import styles from '../styles/MoveStats.module.css'

interface Props{
  numMovesInDB:number
  numGamesInDB:number
}

export default function MoveStats(props:Props) {

  return (
    <div className={styles.container}>
      <p>{`${props.numGamesInDB} game(s) in database`}</p>
      <div>&#8226;</div>
      <p>{`${props.numMovesInDB} possible move(s) in database`}</p>
    </div>
    
  )
}
