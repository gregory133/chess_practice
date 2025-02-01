import React, { useState, useEffect, useRef, ReactElement } from 'react'
import InfoIcon from '@mui/icons-material/Info';
import styles from './Sidebar.module.scss'

import { useChessStore } from '../../stores/chessStore'

import LichessDatabaseJSONParser from '../../api/LichessDatabaseJSONParser'
import { Database, fetchDB } from '../../api/DBApi'
import * as cg from 'chessground/types.js';
import { useDatabaseSettingsStore } from '../../stores/databaseSettingsStore'
import DatabaseSettings from '../../interfaces/DatabaseSettings'
import MastersDatabaseSettings from '../../classes/DatabaseSettings/MastersDatabaseSettings'
import LichessDatabaseSettings from '../../classes/DatabaseSettings/LichessDatabaseSettings'
import PlayerDatabaseSettings from '../../classes/DatabaseSettings/PlayerDatabaseSettings'

import { Dictionary } from 'typescript-collections'

import { useMediaQuery } from 'react-responsive'
import SettingsIcon from '@mui/icons-material/Settings';
import InfoLayout from './InfoLayout/InfoLayout';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DatabaseLayout from './DatabaseLayout/DatabaseLayout';

interface TopBarOption{
  name:string,
  icon: ReactElement<any, any>
}

export default function Sidebar() {

  const [selectedTopbarIcon, setSelectedTopbarIcon] = useState<string>('Database')
  const [stockfishArrowSuggestion, setStockfishArrowSuggestion]=useState<{from:cg.Key, to:cg.Key}|null>(null)

  const currentFen=useChessStore(state=>state.currentFen)
  const jsonParserRef=useRef(new LichessDatabaseJSONParser(null))
  const database:Database=useChessStore(state=>state.selectedDatabase)

  const isLandscape = useMediaQuery({
    query : '(min-aspect-ratio: 4/5)'
  })

  const topBarOptionsSx = {margin: '0 0.5rem 0 0', width: '2.5rem', height: '2.5rem'}

  const topBarOptions : TopBarOption[] = [
    {
      name: 'Info',
      icon: <InfoIcon sx={topBarOptionsSx}/>
    },
    {
      name: 'Database',
      icon: <MenuBookIcon sx={topBarOptionsSx}/>
    },
    {
      name: 'Settings',
      icon: <SettingsIcon sx={topBarOptionsSx}/>
    }

  ]

  const contentLayoutDict = new Dictionary<string, ReactElement>();{
    contentLayoutDict.setValue('Info', <InfoLayout/>)
    contentLayoutDict.setValue('Database', <DatabaseLayout/>)
  }

  
  const winrate=useChessStore(state=>state.winrate)
  
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
      sizesDict.setValue(0, '3ch')
      sizesDict.setValue(30, '2ch')    
      sizesDict.setValue(60, '1.5ch')   
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

    <div className={styles.main}>
        <div className={styles.topOptions}>
          {
            topBarOptions.map((option, key)=>{
              let backgroundColor = 'none'
              if (option.name == selectedTopbarIcon){
                backgroundColor = '#545454'
              }
              return (
                <div key={key} className={styles.topOptionButton} style={{backgroundColor: backgroundColor}} >
                  {option.icon}
                  {option.name}
                </div>
              )
            })
          }        
        </div>
        <div className={styles.content}>
          {
            contentLayoutDict.getValue(selectedTopbarIcon)
          }
        </div>
    </div>
  )
}
