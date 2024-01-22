import React, { useState, useEffect, useRef } from 'react'
import styles from './Sidebar.module.scss'
import WinrateBar from '../WinrateBar/WinrateBar'
import Winrate from '../../classes/Winrate'
import MoveStats from '../MoveStats/MoveStats'
import SetFen from '../SetFen/SetFen'
import RefreshButton from '../RefreshButton/RefreshButton'
import { useChessStore } from '../../stores/chessStore'
import ColorSelect from '../ColorSelect/ColorSelect'
import DatabaseSelect from '../DatabaseSelect/DatabaseSelect'
import LichessDatabaseJSONParser from '../../api/LichessDatabaseJSONParser'
import { Database, fetchDB } from '../../api/DBApi'
import Stockfish from '../../classes/Stockfish'
import * as cg from 'chessground/types.js';
import DatabaseSettingsFactory from '../../classes/DatabaseSettingsFactory'
import { useDatabaseSettingsStore } from '../../stores/databaseSettingsStore'

export default function Sidebar() {

  const [stockfishArrowSuggestion, setStockfishArrowSuggestion]=useState<{from:cg.Key, to:cg.Key}|null>(null)

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


  const isStockfishArrowActive=useChessStore(state=>state.isStockfishArrowActive)
  const setIsStockfishArrowActive=useChessStore(state=>state.setIsStockfishArrowActive)

  const since=useDatabaseSettingsStore(state=>state.since)
	const until=useDatabaseSettingsStore(state=>state.until)
	const ratings=useDatabaseSettingsStore(state=>state.ratings)
	const timeControls=useDatabaseSettingsStore(state=>state.timeControls)

  /**
	 * updates the state variables associated with the sidebar
	 */
	function updateSidebar(){

    const winrate=jsonParserRef.current.extractWinrate()
    const noMoreGamesInDB=Number.isNaN(winrate.black)
    if (noMoreGamesInDB){
      setIsStockfishArrowActive(true)
      setWinrate(null)
    }
    else{
      setWinrate(winrate)
      setNumGamesInDB(jsonParserRef.current.extractNumGamesInDB())
      setNumMovesInDB(jsonParserRef.current.extractNumMovesInDB())
      const openingName=jsonParserRef.current.extractOpeningName()
      if (openingName){
        setOpeningName(openingName)
      }	
    }
		
	}

  /**
   * 
   * @param move move to convert to 'to' and 'from' squares
   * @returns 
   */
  function uciMoveToSquares(move:string):{to:cg.Key, from:cg.Key}{
    const from=move.slice(0, 2) as cg.Key
    const to=move.slice(2, 4) as cg.Key
    return {from:from, to:to}
  }

  useEffect(()=>{
    if (!isStockfishArrowActive){
      setStockfishArrowSuggestion(null)
    }
    else{
      Stockfish.getEval(currentFen)
			.then(evaluation=>{
				const from=evaluation.bestMove.substring(0, 2) as cg.Key
				const to=evaluation.bestMove.substring(2, evaluation.bestMove.length) as cg.Key

				setStockfishArrowSuggestion({from:from, to:to})
			})
    }
  }, [isStockfishArrowActive])

  useEffect(()=>{

    fetchDB(currentFen, new DatabaseSettingsFactory(since, until, timeControls, ratings).constructDatabaseSettingsObject(database)!)
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
          winrate ? <WinrateBar winrate={winrate}/> : <WinrateBar winrate={null}/>
        }
      </div>
      {
        (numGamesInDB && numMovesInDB && winrate) 
          ? (<MoveStats numGamesInDB={numGamesInDB} 
          numMovesInDB={numMovesInDB}/>)
          : <div className={styles.noMoreGame}>There are no more Games in the Database</div>
      }
      <SetFen/>
      <ColorSelect/>
      <DatabaseSelect/>
    </div>
  )
}
