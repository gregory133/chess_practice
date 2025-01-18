import React, { useState, useEffect, useRef } from 'react'
import styles from './Sidebar.module.scss'
import WinrateBar from './WinrateBar/WinrateBar'
import Winrate from '../../classes/Winrate'
import MoveStats from './MoveStats/MoveStats'
import SetFen from './SetFen/SetFen'
import { useChessStore } from '../../stores/chessStore'
import ColorSelect from './ColorSelect/ColorSelect'
import DatabaseSelect from './DatabaseSelect/DatabaseSelect'
import LichessDatabaseJSONParser from '../../api/LichessDatabaseJSONParser'
import { Database, fetchDB } from '../../api/DBApi'
import * as cg from 'chessground/types.js';
import { useDatabaseSettingsStore } from '../../stores/databaseSettingsStore'
import DatabaseSettings from '../../interfaces/DatabaseSettings'
import MastersDatabaseSettings from '../../classes/DatabaseSettings/MastersDatabaseSettings'
import LichessDatabaseSettings from '../../classes/DatabaseSettings/LichessDatabaseSettings'
import PlayerDatabaseSettings from '../../classes/DatabaseSettings/PlayerDatabaseSettings'
import { Dictionary } from 'typescript-collections'
import DatabaseSelectParams from './DatabaseSelectParams/DatabaseSelectParams'
import ResetBar from './ResetBar/ResetBar'
import { useMediaQuery } from 'react-responsive'

export default function Sidebar() {

  const [stockfishArrowSuggestion, setStockfishArrowSuggestion]=useState<{from:cg.Key, to:cg.Key}|null>(null)

  const currentFen=useChessStore(state=>state.currentFen)
  const jsonParserRef=useRef(new LichessDatabaseJSONParser(null))
  const database:Database=useChessStore(state=>state.selectedDatabase)

  const isLandscape = useMediaQuery({
    query : '(min-aspect-ratio: 4/5)'
  })


  const openingName=useChessStore(state=>state.openingName)
  const winrate=useChessStore(state=>state.winrate)
  const numGamesInDB=useChessStore(state=>state.numGamesInDB)
  const numMovesInDB=useChessStore(state=>state.numMovesInDB)
  const evaluation=useChessStore(state=>state.evaluation)

  const setWinrate=useChessStore(state=>state.setWinrate)
	const setOpeningName=useChessStore(state=>state.setOpeningName)
	const setNumGamesInDB=useChessStore(state=>state.setNumGamesInDB)
	const setNumMovesInDB=useChessStore(state=>state.setNumMovesInDB)


  const isStockfishArrowActive=useChessStore(state=>state.isStockfishArrowActive)
  const setIsStockfishArrowActive=useChessStore(state=>state.setIsStockfishArrowActive)

  const lichessOptions = useDatabaseSettingsStore(state=>state.lichessOptions)
  const mastersOptions = useDatabaseSettingsStore(state=>state.mastersOptions)
  const playerOptions = useDatabaseSettingsStore(state=>state.playerOptions)

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
   * returns a string that corresponds to the css font size of the opening name 
   * based on the number of characters in the opening name
   */
  function openingNameFontSize(openingName:string):string{

    let returnVal:string = ''
    
    const numChar = openingName.length
    const sizesDict = new Dictionary<number, string>();{
      sizesDict.setValue(0, '3.5cqh')
      sizesDict.setValue(30, '2.5cqh')    
      sizesDict.setValue(80, '2cqh')   
    }

    const keys = sizesDict.keys().sort()
    
    keys.forEach(key=>{
        if (numChar > key){
          returnVal = sizesDict.getValue(key)!
        }
    })

    return returnVal
  }

  useEffect(()=>{
    if (!isStockfishArrowActive){
      setStockfishArrowSuggestion(null)
    }
    else{
      if (evaluation){
        const from=evaluation.bestMove.substring(0, 2) as cg.Key
				const to=evaluation.bestMove.substring(2, evaluation.bestMove.length) as cg.Key
				setStockfishArrowSuggestion({from:from, to:to})
      }
			else{
        setStockfishArrowSuggestion(null)
      }
			
    }
  }, [isStockfishArrowActive])

  useEffect(()=>{

    let databaseSettings : DatabaseSettings
    if (database=='masters'){
      databaseSettings = new MastersDatabaseSettings(currentFen, mastersOptions.since, 
      mastersOptions.until)
    }
    else if (database == 'lichess'){
      databaseSettings = new LichessDatabaseSettings(currentFen, lichessOptions.timeControls, 
      lichessOptions.ratings)
    }
    else{
      databaseSettings = new PlayerDatabaseSettings(playerOptions.username, playerOptions.color, 
      playerOptions.maxGames, playerOptions.vsPlayer, playerOptions.timeControl)
    }

    fetchDB(databaseSettings)
		.then(json=>{
			jsonParserRef.current.setJson(json)
      updateSidebar()
		})	

  }, [currentFen])

  return (
    <div className={styles.sidebar}>
      <p className={styles.openingName} style={{
          fontSize: openingNameFontSize(openingName)
        }}>
        {openingName}
      </p>
      <div className={styles.winrateBarContainer}>
        {
          winrate ? <WinrateBar winrate={winrate}/> : <WinrateBar winrate={null}/>
        }
      </div>
      <div className={styles.moveStatsContainer}>
        {
          (numGamesInDB && numMovesInDB && winrate) 
            ? (<MoveStats numGamesInDB={numGamesInDB} 
            numMovesInDB={numMovesInDB}/>)
            : <div className={styles.noMoreGame}>There are no more Games in the Database</div>
        }
      </div>
      <SetFen/>
      {
        isLandscape 
          ? <ResetBar/>
          : null
      }
      
      <ColorSelect/>
      <DatabaseSelect/>
      <DatabaseSelectParams/>
    </div>
  )
}
