import React, { useEffect, useState } from 'react'
import OptionButton, { Button } from '../OptionsButton/OptionButton'
import styles from './DatabaseSelect.module.scss'
import { useChessStore } from '../../stores/chessStore'
import { Database } from '../../api/DBApi'
import Modal from 'react-modal';
import DatabaseSettingsModal from '../DatabaseSettingsModal/DatabaseSettingsModal'
import { Dictionary } from 'typescript-collections'

export default function DatabaseSelect() {

  const selectedDatabase=useChessStore(state=>state.selectedDatabase)
  const setSelectedDatabase=useChessStore(state=>state.setSelectedDatabase)

  const [selectedId, setSelectedId]=useState<string>(selectedDatabase)
  const [isDatabaseModalOpen, setIsDatabaseModalOpen]=useState(false)

  const buttonNameDict = new Dictionary<string, string>();{
    buttonNameDict.setValue('masters', 'Master Database')
    buttonNameDict.setValue('lichess', 'Lichess Database')
    buttonNameDict.setValue('player', 'Lichess Player Database')
  }
  
  const buttons: Button[]=[
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

    {id: 'player', bgImage: `${process.env.PUBLIC_URL}/images/user.png`, 
    onClick:()=>{
      onClickDatabaseButton('player')
    },
    hoverText: 'Use Player Database'}
  ]

  function onClickDatabaseButton(id:Database){
    setSelectedId(id)
    setSelectedDatabase(id)
  }

  function onClickSettingsButton(){
    setIsDatabaseModalOpen(true)
  }

  useEffect(()=>{
    // console.log(selectedDatabase);
  }, [selectedDatabase])

  return (
    <div className={styles.parent}>
      <div onClick={onClickSettingsButton} className={styles.settingsButton}/>
      <p>Select Database: </p>
      <div className={styles.container}>
        {
          buttons.map((button:Button, key:number)=>{
            return(
              <div className={styles.button}>
                <OptionButton button={button} key={key}
                isHighlighted={button.id==selectedId}/>
                <p>{buttonNameDict.getValue(button.id)}</p>
              </div>
            )
          })
        }
      </div>

      <DatabaseSettingsModal isOpen={isDatabaseModalOpen} setIsOpen={setIsDatabaseModalOpen}/>
    </div>
  )
}
