import React, { ChangeEvent, useEffect, useState } from 'react'
// import OptionButton, { Button } from '../OptionsButton/OptionButton'
import styles from './DatabaseSelect.module.scss'
import { useChessStore } from '../../../stores/chessStore'
import { Database } from '../../../api/DBApi'
import Modal from 'react-modal';
import { Dictionary } from 'typescript-collections'
import { useDatabaseSettingsStore } from '../../../stores/databaseSettingsStore'
import OptionButton, { OptionButtonInterface } from '../OptionsButton/OptionButton';


export default function DatabaseSelect() {

  
  
  const [isDatabaseModalOpen, setIsDatabaseModalOpen]=useState(false)
  const [testDate, setTestDate] = useState<Date>(new Date(Date.now()))

  
  
  const selectedDatabase=useChessStore(state=>state.selectedDatabase)
  const [selectedId, setSelectedId]=useState<string>(selectedDatabase)
  

  const setSelectedDatabase=useChessStore(state=>state.setSelectedDatabase)

  const buttonNameDict = new Dictionary<string, string>();{
    buttonNameDict.setValue('masters', 'Master Database')
    buttonNameDict.setValue('lichess', 'Lichess Database')
    buttonNameDict.setValue('player', 'Player Database')
    
  }

  const buttons: OptionButtonInterface[]=[
          {id: 'masters', bgImage: `${process.env.PUBLIC_URL}/images/masters.png`,
          onClick:()=>{
            onClickDatabaseButton('masters')
          },
      
          hoverText: 'Use Masters Database'},
          {id: 'lichess', bgImage: `${process.env.PUBLIC_URL}/images/lichess.png`, 
          onClick:()=>{
            onClickDatabaseButton('lichess')
          },
      
          hoverText: 'Use Lichess Database'},
      
          // {id: 'player', bgImage: `${process.env.PUBLIC_URL}/images/user.png`, 
          // onClick:()=>{
          //   onClickDatabaseButton('player')
          // },
          // hoverText: 'Use Player Database'}
  ]

  function onClickDatabaseButton(id:Database){
    setSelectedId(id)
    setSelectedDatabase(id)
  }

  return (
      <div className={styles.parent}>
        <span className={styles.selectDatabase}>Select Database: </span>
        <div className={styles.container}>
          {
            buttons.map((button:OptionButtonInterface, key:number)=>{
              return(
                <div key={key} className={styles.button}>
                  <OptionButton button={button} 
                  isHighlighted={button.id==selectedId}/>
                </div>
              )
            })
          }
        </div>
      </div>
      

    
  )
}