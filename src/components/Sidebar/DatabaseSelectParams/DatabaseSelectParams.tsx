import React, { ChangeEvent, useState } from 'react'
import InputTextbox from '../../InputTextbox/InputTextbox'
import { FormControl, FormControlLabel, Radio, RadioGroup, Slide } from '@mui/material'
import styles from './DatabaseSelectParams.module.scss'
import YearPicker from '../../YearPicker/YearPicker'
import { YEAR_LOWER_BOUND, YEAR_UPPER_BOUND } from '../../../constants/MastersDatabase'
import { Mark } from '@mui/material/Slider/useSlider.types'
import { Rating } from '../../../types/Rating'
import { TimeControl } from '../../../types/TimeControl'
import { useChessStore } from '../../../stores/chessStore'
import { OptionButtonInterface } from '../OptionsButton/OptionButton'
import { Database } from '../../../api/DBApi'
import { useDatabaseSettingsStore } from '../../../stores/databaseSettingsStore'
import { Dictionary } from 'typescript-collections'
import Slider from '@mui/material/Slider';

export default function DatabaseSelectParams() {

    const selectedDatabase=useChessStore(state=>state.selectedDatabase)
    const setSelectedDatabase=useChessStore(state=>state.setSelectedDatabase)
    const [selectedId, setSelectedId]=useState<string>(selectedDatabase)

    const [ratingSliderValue, setRatingSliderValue] = useState<number[]>([50, 75])
    const [timeControlSliderValue, setTimeControlSliderValue] = useState<number[]>([40, 100])
    
    const mastersOptions = useDatabaseSettingsStore(state=>state.mastersOptions)
    const lichessOptions = useDatabaseSettingsStore(state => state.lichessOptions)
    const playerOptions = useDatabaseSettingsStore(state => state.playerOptions)
    const setMastersOptions = useDatabaseSettingsStore(state=>state.setMastersOptions)
    const setLichessOptions = useDatabaseSettingsStore(state=>state.setLichessOptions)
    const setPlayerOptions = useDatabaseSettingsStore(state=>state.setPlayerOptions)

    function MastersView(){

        function onMastersSinceYearChange(year:number){
          setMastersOptions({since: year, until: mastersOptions.until})
        }
    
        function onMastersUntilYearChange(year:number){
          setMastersOptions({since: mastersOptions.since, until: year})
        }

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
                    width: '90%',
                    margin: '0px 15px',
                    '& .MuiSlider-markLabel' : {
                        color : 'white'
                    },
                    '& .MuiSlider-rail':{
                        backgroundColor: 'white'
                    },
                    '& .MuiSlider-track' : {
                        color : 'white'
                    },
                    '& .MuiSlider-thumb' : {
                        color : 'white'
                    },
                    '& .MuiSlider-mark':{
                        color: 'white'
                    }
                }} onChange={onChangeTimeControlSlider} value={timeControlSliderValue}
                step={100/(allTimeControls.length-1)} marks={timeControlSliderMarks} />
            </div>
            <div className={styles.ratings}>
            <Slider sx={{
                width: '90%',
                margin: '0px 15px',  
                '& .MuiSlider-markLabel' : {
                    color : 'white'
                },
                '& .MuiSlider-rail':{
                    backgroundColor: 'white'
                },
                '& .MuiSlider-track' : {
                    color : 'white'
                },
                '& .MuiSlider-thumb' : {
                    color : 'white'
                },
                '& .MuiSlider-mark':{
                    color: 'white'
                }
            }} onChange={onChangeRatingSlider} value={ratingSliderValue}
            step={100/(allRatings.length-1)} marks={ratingSliderMarks} />
            </div>
        </div>
    )
    }

    function PlayerView(){

        function onChangeColor(event:ChangeEvent<HTMLInputElement>){
            const newColor = event.target.value as 'white'|'black'
            setPlayerOptions({username: playerOptions.username, color: newColor})
        }

        function onChangePlayerUsername(newValue:string){
            setPlayerOptions({username: newValue, color:playerOptions.color})
        }

        return (
            <div className={styles.playerView}>
            <div className={styles.row1}>
                <InputTextbox onChange={onChangePlayerUsername}/>
                <div className={styles.radioGroupWrapper}>
                <RadioGroup onChange={onChangeColor} row defaultValue='white'>
                    <FormControlLabel value="white" control={<Radio sx={{
                    '& .MuiSvgIcon-root' : {
                        color: 'white'
                    }
                    }}/>} label="White" />
                    <FormControlLabel value="black" control={<Radio sx={{
                    '& .MuiSvgIcon-root' : {
                        color: 'white'
                    }
                    }}/>} label="Black" />
                </RadioGroup>
                </div>
                
            </div>
            
            </div>
        )
    }
    
  return (
    <div className={styles.main}>
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

