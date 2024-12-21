import React, { useEffect, useState } from 'react'
import OptionButton, { Button } from '../OptionsButton/OptionButton'
import styles from './DatabaseSelect.module.scss'
import { useChessStore } from '../../stores/chessStore'
import { Database } from '../../api/DBApi'
import Modal from 'react-modal';
import { Dictionary } from 'typescript-collections'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { styled } from '@mui/material'
import YearPicker from '../YearPicker/YearPicker'
import { YEAR_LOWER_BOUND, YEAR_UPPER_BOUND } from '../../constants/MastersDatabase'
import { useDatabaseSettingsStore } from '../../stores/databaseSettingsStore'

export default function DatabaseSelect() {

  const selectedDatabase=useChessStore(state=>state.selectedDatabase)
  const setSelectedDatabase=useChessStore(state=>state.setSelectedDatabase)

  const [selectedId, setSelectedId]=useState<string>(selectedDatabase)
  const [isDatabaseModalOpen, setIsDatabaseModalOpen]=useState(false)
  const [testDate, setTestDate] = useState<Date>(new Date(Date.now()))

  const mastersOptions = useDatabaseSettingsStore(state=>state.mastersOptions)
  const setMastersOptions = useDatabaseSettingsStore(state=>state.setMastersOptions)

  const allDatabases : Database[] = ['lichess', 'masters', 'player']

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

  function onMastersSinceYearChange(year:number){
    setMastersOptions({since: year, until: mastersOptions.until})
  }

  function onMastersUntilYearChange(year:number){
    setMastersOptions({since: mastersOptions.since, until: year})
  }

  useEffect(()=>{
    console.log(mastersOptions)
  }, [mastersOptions])

  return (
    <div className={styles.main}>
      <div className={styles.parent}>
        <div onClick={onClickSettingsButton} className={styles.settingsButton}/>
        <p>Select Database: </p>
        <div className={styles.container}>
          {
            buttons.map((button:Button, key:number)=>{
              return(
                <div key={key} className={styles.button}>
                  <OptionButton button={button} 
                  isHighlighted={button.id==selectedId}/>
                  <p>{buttonNameDict.getValue(button.id)}</p>
                </div>
              )
            })
          }
        </div>
      </div>
      {
        allDatabases.map((database, key)=>{
          if (database == 'masters'){
            return (
              <div className={styles.mastersDatepickers}>
                <YearPicker onChange={onMastersSinceYearChange} label='since' currentYear={mastersOptions.since} 
                yearOrder='asc' defaultYear={YEAR_LOWER_BOUND} minYear={YEAR_LOWER_BOUND} 
                maxYear={mastersOptions.until}/>

                <YearPicker onChange={onMastersUntilYearChange} label='until' currentYear={mastersOptions.until} 
                yearOrder='desc' defaultYear={YEAR_UPPER_BOUND} minYear={mastersOptions.since} 
                maxYear={YEAR_UPPER_BOUND}/>
              </div>
            )

          }
          else if (database == 'player'){

          }
          else if (database == 'lichess'){
            
          }
          return <></>
        })
      }
    </div>
    
  )
}
