import React, { useEffect, useState } from 'react'
import styles from './LichessView.module.scss'
import { TimeControl } from '../../../types/TimeControl'
import { Dictionary } from 'typescript-collections'
import { Rating } from '../../../types/Rating'

export default function LichessView() {

  const timeControls:TimeControl[]=['ultrabullet', 'bullet', 'blitz', 'rapid', 'classical', 'correspondence']
  const ratings:Rating[]=[400, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2500]

  const UNSELECTED_BUTTON_COLOR='#393632'
  const SELECTED_BUTTON_COLOR='#629924'

  const [selectedIcons, setSelectedIcons]=useState<{
    'ultrabullet': boolean,
    'bullet': boolean,
    'blitz': boolean,
    'rapid': boolean,
    'classical': boolean,
    'correspondence': boolean}>({
    'ultrabullet':false,
    'bullet':false,
    'blitz':true,
    'rapid':true,
    'classical':true,
    'correspondence':true
  })

  const [selectedRatings, setSelectedRatings]=useState<{
    400: boolean,
    1000: boolean,
    1200: boolean,
    1400: boolean,
    1600: boolean,
    1800: boolean,
    2000: boolean,
    2200: boolean,
    2500: boolean
  }>({
    400: false,
    1000: false,
    1200: false,
    1400: false,
    1600: false,
    1800: true,
    2000: true,
    2200: true,
    2500: true
  })
  
  function onClickTimeControlButton(timeControl: TimeControl){
    const isToggled=selectedIcons[timeControl]
    selectedIcons[timeControl]=!isToggled
    setSelectedIcons({...selectedIcons})
  }

  function onClickRatingButton(rating: Rating){
    const isToggled=selectedRatings[rating]
    selectedRatings[rating]=!isToggled
    setSelectedRatings({...selectedRatings})
  }

  return (
    <div className={styles.container}>
      <div>
        <p className={styles.timeControl}>Time Control</p>
        <div>
          {timeControls.map((timeControl:TimeControl, key:number)=>{

            const bgColor=selectedIcons[timeControl] ? SELECTED_BUTTON_COLOR : UNSELECTED_BUTTON_COLOR

            return (
            <div title={timeControl} onClick={()=>onClickTimeControlButton(timeControl)} className={styles.toggleableButton}
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

            const bgColor=selectedRatings[rating] ? SELECTED_BUTTON_COLOR : UNSELECTED_BUTTON_COLOR

            return (
              <div onClick={()=>onClickRatingButton(rating)} style={{backgroundColor: bgColor}} 
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
