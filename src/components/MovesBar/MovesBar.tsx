import React from 'react'
import styles from './MovesBar.module.scss'
import { Dictionary } from 'typescript-collections'
import Playrate from '../../classes/Playrate'
import Winrate from '../../classes/Winrate'

export default function MovesBar() {

  const movesPlayRate = new Playrate()

  {
    movesPlayRate.add('e4', 0.45, new Winrate(0.24, 0.32))
    movesPlayRate.add('d4', 0.36, new Winrate(0.23, 0.33))
    movesPlayRate.add('Nf3', 0.10, new Winrate(0.22, 0.34))
    movesPlayRate.add('c4', 0.07, new Winrate(0.23, 0.34))
    movesPlayRate.add('g3', 0.01, new Winrate(0.25, 0.36))
  }
  
  console.log(movesPlayRate.toString())

  return (
    <div className={styles.main}>
        <div className={styles.bar}>
      
        </div>
    </div>
  )
}
