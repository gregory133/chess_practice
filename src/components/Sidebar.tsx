import React, { useEffect, useRef } from 'react'
import styles from '../styles/Sidebar.module.css'
import WinrateBar from './WinrateBar'
import Winrate from '../classes/Winrate'
import MoveStats from './MoveStats'
import SetFen from './SetFen'
import RefreshButton from './RefreshButton'
import { useChessStore } from '../stores/chessStore'
import ColorSelect from './ColorSelect'
import DatabaseSelect from './DatabaseSelect'
import LichessDatabaseJSONParser from '../api/LichessDatabaseJSONParser'
import { Database, fetchDB } from '../api/DBApi'


export default function Sidebar() {

  const currentFen=useChessStore(state=>state.currentFen)
  const jsonParserRef=useRef(new LichessDatabaseJSONParser(null))
  const database:Database=useChessStore(state=>state.selectedDatabase)

  const openingName=useChessStore(state=>state.openingName)
  const winrate=useChessStore(state=>state.winrate)
  const numGamesInDB=useChessStore(state=>state.numGamesInDB)
  const numMovesInDB=useChessStore(state=>state.numMovesInDB)

  const setWinrate=useChessStore(state=>state.setWinrate)
	const setOpeningName=useChessStore(state=>state.setOpeningName)
	const setNumGamesInDB=useChessStore(state=>state.setNumGamesInDB)
	const setNumMovesInDB=useChessStore(state=>state.setNumMovesInDB)

  /**
	 * updates the state variables associated with the sidebar
	 */
	function updateSidebar(){
		setWinrate(jsonParserRef.current.extractWinrate())
		setNumGamesInDB(jsonParserRef.current.extractNumGamesInDB())
		setNumMovesInDB(jsonParserRef.current.extractNumMovesInDB())
		const openingName=jsonParserRef.current.extractOpeningName()
		if (openingName){
			setOpeningName(openingName)
		}	
	}

  useEffect(()=>{

    fetchDB(currentFen, database)
		.then(json=>{
			jsonParserRef.current.setJson(json)
      updateSidebar()
		})	

  }, [currentFen])

  return (
    <div className={styles.sidebar}>
      <p className={styles.openingName}>{openingName}</p>
      <div className={styles.winrateBarContainer}>
        {
          winrate ? <WinrateBar winrate={winrate}/> : null
        }
      </div>
      {
        (numGamesInDB && numMovesInDB) 
          ? (<MoveStats numGamesInDB={numGamesInDB} 
          numMovesInDB={numMovesInDB}/>)
          : null
      }
      <SetFen/>
      <ColorSelect/>
      <DatabaseSelect/>
    </div>
  )
}
