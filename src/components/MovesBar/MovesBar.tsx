import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from './MovesBar.module.scss'
import WinrateBar from '../Winrate/WinrateBar'
// import { fetchDB, getPlayrateFromDB, getSanListFromDB } from '../../api/DBApi'
// import { useChessStore } from '../../stores/chessStore'
import Switch from '@mui/material/Switch';
import Playrate from '../../classes/Playrate';
import DatabaseAPI from '../../api/DatabaseAPI';
import Winrate from '../../classes/Winrate';
import { SettingsContext } from '../../App';

import StorageIcon from '@mui/icons-material/Storage';
interface Props{
  fen:string
}

export default function MovesBar(props:Props) {

  // const playrate = useChessStore(state=>state.playrate)
  const [isDisabled, setIsDisabled] = useState(false)
  const [playrate, setPlayrate] = useState<Playrate>(new Playrate())
  const playrateRef = useRef<null | Playrate>(null)

  const {database} = useContext(SettingsContext)!


  useEffect(()=>{

	getPlayrate(props.fen)
    .then(playrate=>{
    	setPlayrate(playrate)
    })

  }, [props.fen, database])

  function onChangeDisableSwitch(event:any, checked:boolean){
    setIsDisabled(!checked)
  }

  /**this function computes and returns the Playrate object associated with the current FEN string*/
	function getPlayrate(fen:string): Promise<Playrate>{

    const MAX_NUM_MOVES_DISPLAYED = 5

		return new Promise((resolve, reject)=>{

	 		DatabaseAPI.getInstance().getPositionInfoVerbose(fen, database).then(responseObj=>{
			
				
				const playrate = new Playrate()
				const totalNumGames = responseObj.white + responseObj.black + responseObj.draws

				for (let i=0; i< Math.min(responseObj.moves.length, MAX_NUM_MOVES_DISPLAYED); i++){

					const move = responseObj.moves[i].san
					const numGames = responseObj.moves[i].white + responseObj.moves[i].black + responseObj.moves[i].draws

					playrate.add(move, parseFloat((numGames/totalNumGames).toFixed(2)), new Winrate(
						responseObj.moves[i].black/numGames, responseObj.moves[i].white/numGames
					))

				}

        		resolve(playrate)

			})

		})

	}

  return (
    <div className={styles.main}>
        <div className={styles.bar}>
          <div className={styles.title}>
            <div className={styles.titleDatabase}>
              <StorageIcon sx={{margin: '0 1rem 0 0'}}/>
              Database Moves
            </div>
            
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
