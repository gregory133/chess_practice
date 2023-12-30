import React from 'react'
import styles from './LichessView.module.scss'
import { TimeControl } from '../../../types/TimeControl'

export default function LichessView() {

  const timeControls:TimeControl[]=['ultrabullet', 'bullet', 'blitz', 'rapid', 'classical', 'correspondence']

  function onClickTimeControlButton(timeControl: TimeControl){
    
  }

  return (
    <div className={styles.container}>
      <div>
        <p>Time Control</p>
        <div>
          {timeControls.map((timeControl:TimeControl, key:number)=>{
            return (
              <div onClick={()=>onClickTimeControlButton(timeControl)} className={styles.toggleableButton}>
                {timeControl}
              </div>
            )
          })}
        </div>
        
      </div>

      <div>
        <p>Average Rating</p>
        <div>
          {timeControls.map((timeControl:TimeControl, key:number)=>{

          return null;
          })}
        </div>
      </div>
      
    </div>
  )
}
