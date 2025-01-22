import React, { useEffect, useState } from 'react'
import styles from './MovesBar.module.scss'
import { Dictionary } from 'typescript-collections'
import Playrate from '../../classes/Playrate'
import Winrate from '../../classes/Winrate'
import WinrateBar from '../Sidebar/WinrateBar/WinrateBar'
import { fetchDB, getPlayrateFromDB, getSanListFromDB } from '../../api/DBApi'
import MastersDatabaseSettings from '../../classes/DatabaseSettings/MastersDatabaseSettings'
import DatabaseSettings from '../../interfaces/DatabaseSettings'
import { useChessStore } from '../../stores/chessStore'

export default function MovesBar() {

  const playrate = useChessStore(state=>state.playrate)
  
  return (
    <div className={styles.main}>
        <div className={styles.bar}>
          <div className={styles.title}>
            Database Moves
          </div>
          <div className={styles.playrateList}>
            {
              playrate.getDict().keys().map((move:string, index:number)=>{
                return (
                  <div key={index} className={styles.playrateListItem}>
                    <span className={styles.move}>{move}</span>
                    <span className={styles.playrate}>
                      {Math.round(playrate.getDict().getValue(move)!.playrate * 10000) / 100}%
                    </span>
                    <WinrateBar winrate={playrate.getDict().getValue(move)!.winrate}/>
                  </div>
                )
              })
            }
          </div>
        </div>
    </div>
  )
}
