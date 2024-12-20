import React, { useEffect, useState } from 'react'
import styles from './LichessView.module.scss'
import { TimeControl } from '../../../types/TimeControl'
import { Dictionary } from 'typescript-collections'
import { Rating } from '../../../types/Rating'
import { useDatabaseSettingsStore } from '../../../stores/databaseSettingsStore'
import { printSet } from '../../../library/Printer'

export default function LichessView() {

  const timeControls:TimeControl[]=['ultraBullet', 'bullet', 'blitz', 'rapid', 'classical', 
    'correspondence']
  const ratings:Rating[]=[400, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2500]

  const lichessOptions=useDatabaseSettingsStore(state=>state.lichessOptions)
  const setLichessOptions = useDatabaseSettingsStore(state=>state.setLichessOptions)

  const UNSELECTED_BUTTON_COLOR='#393632'
  const SELECTED_BUTTON_COLOR='#629924'

  /**
   * Removes the given timeControl from the list of lichess timecontrols if it is there or adds
   * the timeControl from the list if it isn't. Then, updates the store
   * @param timeControl 
   */
  function toggleTimeControl(timeControl : TimeControl){
    let timeControls = lichessOptions.timeControls
    if (timeControls.includes(timeControl)){
      timeControls = timeControls.filter(element => element != timeControl)
    }
    else{
      timeControls.push(timeControl)
    }
    setLichessOptions({timeControls : timeControls, ratings : lichessOptions.ratings})

  }

  /**
   * Removes the given rating from the list of lichess rating if it is there or adds
   * the rating from the list if it isn't. Then, updates the store
   * @param rating 
   */
  function toggleRating(rating : Rating){
    let ratings = lichessOptions.ratings
    if (ratings.includes(rating)){
      ratings = ratings.filter(element => element != rating)
    }
    else{
      ratings.push(rating)
    }
    setLichessOptions({timeControls : lichessOptions.timeControls, ratings : ratings})
  }

  return (
    <div className={styles.container}>
      <div className={styles.timeControl}>
        <p >Time Control</p>
        <div>
          {timeControls.map((timeControl:TimeControl, key:number)=>{

            const bgColor=lichessOptions.timeControls.includes(timeControl) ? SELECTED_BUTTON_COLOR : 
            UNSELECTED_BUTTON_COLOR

            return (
            <div title={timeControl} onClick={()=>toggleTimeControl(timeControl)} 
            className={styles.toggleableButton}
              style={{
                backgroundColor: bgColor
              }}>
                <img src={process.env.PUBLIC_URL+`/images/timeControlIcons/${timeControl}.png`}/>
              </div>
            )
          })}
        </div>
        
      </div>

      <div className={styles.rating}>
        <p>Average Rating</p>
        <div>
          {ratings.map((rating:Rating, key:number)=>{

            const bgColor=lichessOptions.ratings.includes(rating) ? SELECTED_BUTTON_COLOR : 
            UNSELECTED_BUTTON_COLOR

            return (
              <div onClick={()=>toggleRating(rating)} style={{backgroundColor: bgColor}} 
              className={styles.toggleableButton}>
                {rating}
              </div>
            )
          })}
        </div>
      </div>
      
    </div>
  )
}
