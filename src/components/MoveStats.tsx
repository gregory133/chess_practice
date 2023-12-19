import React from 'react'
import styles from '../styles/MoveStats.module.scss'

interface Props{
  numMovesInDB:number
  numGamesInDB:number
}

export default function MoveStats(props:Props) {

  function prettyPrintNumber(num:number):string{
    const formatter=Intl.NumberFormat('en', {notation: 'compact'})
    return formatter.format(num)
  }

  return (
    <div className={styles.container}>
      <p>{`${prettyPrintNumber(props.numGamesInDB)} game(s) in database`}</p>
      <div>&#8226;</div>
      <p>{`${props.numMovesInDB} possible move(s) in database`}</p>
    </div>
    
  )
}
