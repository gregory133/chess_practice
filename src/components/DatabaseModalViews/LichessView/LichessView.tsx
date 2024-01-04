import React, { useEffect, useState } from 'react'
import styles from './LichessView.module.scss'
import { TimeControl } from '../../../types/TimeControl'
import { Dictionary } from 'typescript-collections'
import { Rating } from '../../../types/Rating'
import { useDatabaseSettingsStore } from '../../../stores/databaseSettingsStore'
import { printSet } from '../../../library/Printer'

export default function LichessView() {

  const timeControls:TimeControl[]=['ultrabullet', 'bullet', 'blitz', 'rapid', 'classical', 'correspondence']
  const ratings:Rating[]=[400, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2500]

  const selectedTimeControls=useDatabaseSettingsStore(state=>state.timeControls)
  const toggleTimeControl=useDatabaseSettingsStore(state=>state.toggleTimeControl)

  const selectedRatings=useDatabaseSettingsStore(state=>state.ratings)
  const toggleRating=useDatabaseSettingsStore(state=>state.toggleRating)

  const UNSELECTED_BUTTON_COLOR='#393632'
  const SELECTED_BUTTON_COLOR='#629924'

  return (
    <div className={styles.container}>
      <div className={styles.timeControl}>
        <p >Time Control</p>
        <div>
          {timeControls.map((timeControl:TimeControl, key:number)=>{

            const bgColor=selectedTimeControls.contains(timeControl) ? SELECTED_BUTTON_COLOR : UNSELECTED_BUTTON_COLOR

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

            const bgColor=selectedRatings.contains(rating) ? SELECTED_BUTTON_COLOR : UNSELECTED_BUTTON_COLOR

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
