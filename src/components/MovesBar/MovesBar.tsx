import React, { useEffect, useState } from 'react'
import styles from './MovesBar.module.scss'
import { Dictionary } from 'typescript-collections'
import Playrate from '../../classes/Playrate'
import Winrate from '../../classes/Winrate'
import WinrateBar from '../Sidebar/WinrateBar/WinrateBar'
import { fetchDB, getPlayrateFromDB, getSanListFromDB } from '../../api/DBApi'
import MastersDatabaseSettings from '../../classes/DatabaseSettings/MastersDatabaseSettings'
import DatabaseSettings from '../../interfaces/DatabaseSettings'

export default function MovesBar() {

  const [movesPlayRate, setMovesPlayRate] = useState<Playrate | null>(null)

  useEffect(()=>{
    const db : DatabaseSettings = new MastersDatabaseSettings('rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', 
      1952, 2024
    )
    fetchDB(db)
    .then(json=>{
      setMovesPlayRate(getPlayrateFromDB('masters', 'black', json))
    })
    
  }, [])

  
  return (
    <div className={styles.main}>
        <div className={styles.bar}>
          <div className={styles.title}>
            Database Moves
          </div>
          <div className={styles.playrateList}>
            {
              movesPlayRate?.getDict().keys().map((move:string, index:number)=>{
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
