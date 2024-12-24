import React, { useEffect, useState } from 'react'
// import OptionButton, { Button } from '../OptionsButton/OptionButton'
import styles from './DatabaseSelect.module.scss'
import { useChessStore } from '../../../stores/chessStore'
import { Database } from '../../../api/DBApi'
import Modal from 'react-modal';
import { Dictionary } from 'typescript-collections'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import Button from '@mui/material/Button';
import YearPicker from '../../YearPicker/YearPicker'
import { useDatabaseSettingsStore } from '../../../stores/databaseSettingsStore'
import { YEAR_LOWER_BOUND, YEAR_UPPER_BOUND } from '../../../constants/MastersDatabase'
import { Rating } from '../../../types/Rating'
import { TimeControl } from '../../../types/TimeControl'
import OptionButton, { OptionButtonInterface } from '../OptionsButton/OptionButton';
import SendIcon from '@mui/icons-material/Send';
import Avatar from '@mui/material/Avatar';
import { useDatePickerDefaultizedProps } from '@mui/x-date-pickers/DatePicker/shared';
import Slider from '@mui/material/Slider';
import { Mark } from '@mui/material/Slider/useSlider.types';

export default function DatabaseSelect() {

  const selectedDatabase=useChessStore(state=>state.selectedDatabase)
  const setSelectedDatabase=useChessStore(state=>state.setSelectedDatabase)

  const [selectedId, setSelectedId]=useState<string>(selectedDatabase)
  const [isDatabaseModalOpen, setIsDatabaseModalOpen]=useState(false)
  const [testDate, setTestDate] = useState<Date>(new Date(Date.now()))

  const mastersOptions = useDatabaseSettingsStore(state=>state.mastersOptions)
  const lichessOptions = useDatabaseSettingsStore(state => state.lichessOptions)
  const setMastersOptions = useDatabaseSettingsStore(state=>state.setMastersOptions)
  const setLichessOptions = useDatabaseSettingsStore(state=>state.setLichessOptions)
  
  const [ratingSliderValue, setRatingSliderValue] = useState<number[]>([50, 75])
  const [timeControlSliderValue, setTimeControlSliderValue] = useState<number[]>([40, 100])

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

  function MastersView(){
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

  function LichessView(){

    const UNSELECTED_HOVER_BUTTON_COLOR='#c4c0bb'
    const UNSELECTED_BUTTON_COLOR='#393632'
    const SELECTED_BUTTON_COLOR='#629924'

    const allRatings : Rating[] = [0,1000,1200,1400,1600,1800,2000,2200,2500]
    const allTimeControls : TimeControl[] = ['ultraBullet','bullet','blitz','rapid',
    'classical','correspondence']
    const timeControlLabelDict=new Dictionary<TimeControl, string>();{
      timeControlLabelDict.setValue('ultraBullet', "Ul.Bullet")
      timeControlLabelDict.setValue('bullet', "Bullet")
      timeControlLabelDict.setValue('blitz', "Blitz")
      timeControlLabelDict.setValue('rapid', "Rapid")
      timeControlLabelDict.setValue('classical', "Class.")
      timeControlLabelDict.setValue('correspondence', "Corr.")
    }

    let ratingSliderMarks : Mark[] = []
    let timeControlSliderMarks : Mark[] = []

    allRatings.forEach((rating, index)=>{
      ratingSliderMarks.push(
        {
          value : (index/(allRatings.length-1))*100,
          label : rating
        }
      )
    })

    allTimeControls.forEach((timecontrol, index)=>{
      timeControlSliderMarks.push(
        {
          value : (index/(allTimeControls.length-1))*100,
          label : timeControlLabelDict.getValue(timecontrol)
        }
      )
    })

    function onChangeRatingSlider(event:Event, newValue:number|number[]){
      if (typeof newValue !== 'number'){
        const lowerBound = newValue[0]/(100/(allRatings.length-1))
        const upperBound = newValue[1]/(100/(allRatings.length-1))
        let selectedRatings : Rating[] = []
        for (let i=lowerBound; i<upperBound+1; i++){
          selectedRatings.push(allRatings[i])
        }
        
        setLichessOptions({timeControls: lichessOptions.timeControls, ratings: selectedRatings})
        setRatingSliderValue(newValue)
      }
      
    }

    function onChangeTimeControlSlider(event:Event, newValue:number|number[]){
      if (typeof newValue !== 'number'){
        const lowerBound = newValue[0]/(100/(allTimeControls.length-1))
        const upperBound = newValue[1]/(100/(allTimeControls.length-1))
        let selectedTimeControls : TimeControl[] = []
        for (let i=lowerBound; i<upperBound+1; i++){
          selectedTimeControls.push(allTimeControls[i])
        }

        setLichessOptions({timeControls: selectedTimeControls, ratings: lichessOptions.ratings})
        setTimeControlSliderValue(newValue)
      }
    }


    return (
      <div className={styles.lichessView}>
        <div className={styles.timeControls}>
          <Slider sx={{
            margin: '0px 15px',
            '& .MuiSlider-markLabel' : {
              color : 'white'
            }
          }} onChange={onChangeTimeControlSlider} value={timeControlSliderValue}
            step={100/(allTimeControls.length-1)} marks={timeControlSliderMarks} />
          </div>
        <div className={styles.ratings}>
          <Slider sx={{
            margin: '0px 15px',
            '& .MuiSlider-markLabel' : {
              color : 'white'
            }
          }} onChange={onChangeRatingSlider} value={ratingSliderValue}
            step={100/(allRatings.length-1)} marks={ratingSliderMarks} />
        </div>
      </div>
    )
  }

  function PlayerView(){
    return <div></div>
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
            buttons.map((button:OptionButtonInterface, key:number)=>{
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
        selectedDatabase == 'masters' 
          ? MastersView() 
          : selectedDatabase == 'lichess' 
            ? LichessView()
            : PlayerView()
      }
    </div>
    
  )
}