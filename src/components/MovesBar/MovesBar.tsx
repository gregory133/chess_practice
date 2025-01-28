import React, { useEffect, useState } from 'react'
import styles from './MovesBar.module.scss'
import WinrateBar from '../Sidebar/WinrateBar/WinrateBar'
import { fetchDB, getPlayrateFromDB, getSanListFromDB } from '../../api/DBApi'
import { useChessStore } from '../../stores/chessStore'
import Switch from '@mui/material/Switch';

export default function MovesBar() {

  const playrate = useChessStore(state=>state.playrate)
  const [isDisabled, setIsDisabled] = useState(false)

  function onChangeDisableSwitch(event:any, checked:boolean){
    setIsDisabled(!checked)
  }

  return (
    <div className={styles.main}>
        <div className={styles.bar}>
          <div className={styles.title}>
            Database Moves
            <Switch onChange={onChangeDisableSwitch} defaultChecked/>
          </div>
          <div className={styles.playrateList}>
            {
              isDisabled 
                ? null
                : (
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
                ) 
            }
          </div>
        </div>
    </div>
  )
}
