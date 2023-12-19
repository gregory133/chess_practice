import React, { useEffect, useState } from 'react'
import OptionButton, { Button } from './OptionButton'
import styles from '../styles/DatabaseSelect.module.scss'
import { useChessStore } from '../stores/chessStore'
import { Database } from '../api/DBApi'

export default function DatabaseSelect() {

  const selectedDatabase=useChessStore(state=>state.selectedDatabase)
  const setSelectedDatabase=useChessStore(state=>state.setSelectedDatabase)
  const [selectedId, setSelectedId]=useState<string>(selectedDatabase)
  
  const buttons: Button[]=[
    {id: 'masters', bgImage: `${process.env.PUBLIC_URL}/images/masters.png`,
    onClick:()=>{
      onClickButton('masters')
    },
    hoverText: 'Use Masters Database'},
    {id: 'lichess', bgImage: `${process.env.PUBLIC_URL}/images/lichess.png`, 
    onClick:()=>{
      onClickButton('lichess')
    },
    hoverText: 'Use Lichess Database'}
  ]

  function onClickButton(id:Database){
    setSelectedId(id)
    setSelectedDatabase(id)
  }

  useEffect(()=>{
    // console.log(selectedDatabase);
  }, [selectedDatabase])

  return (
    <div className={styles.parent}>
      <p>Select Database: </p>
      <div className={styles.container}>
        {
          buttons.map((button:Button, key:number)=>{
            return <OptionButton button={button} key={key}
             isHighlighted={button.id==selectedId}/>
          })
        }
      </div>
    </div>
  )
}
