import React from 'react'
import styles from './MovesBar.module.scss'
import { Dictionary } from 'typescript-collections'
import Playrate from '../../classes/Playrate'
import Winrate from '../../classes/Winrate'
import WinrateBar from '../Sidebar/WinrateBar/WinrateBar'

export default function MovesBar() {

  const movesPlayRate = new Playrate()

  {
    movesPlayRate.add('e4', 0.45, new Winrate(0.24, 0.32))
    movesPlayRate.add('d4', 0.36, new Winrate(0.23, 0.33))
    movesPlayRate.add('Nf3', 0.10, new Winrate(0.22, 0.34))
    movesPlayRate.add('c4', 0.07, new Winrate(0.23, 0.34))
    movesPlayRate.add('g3', 0.01, new Winrate(0.25, 0.36))


  }
  
  return (
    <div className={styles.main}>
        <div className={styles.bar}>
          <div className={styles.title}>
            Database Moves
          </div>
          <div className={styles.playrateList}>
            {
              movesPlayRate.getDict().keys().map((move:string, index:number)=>{
                return (
                  <div key={index} className={styles.playrateListItem}>
                    <span className={styles.move}>{move}</span>
                    <span className={styles.playrate}>
                      {Math.round(movesPlayRate.getDict().getValue(move)!.playrate * 10000) / 100}%
                    </span>
                    <WinrateBar winrate={movesPlayRate.getDict().getValue(move)!.winrate}/>
                  </div>
                )
              })
            }
          </div>
        </div>
    </div>
  )
}
