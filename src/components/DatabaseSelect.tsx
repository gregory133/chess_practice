import React from 'react'
import OptionButton, { Button } from './OptionButton'
import styles from '../styles/DatabaseSelect.module.css'

export default function DatabaseSelect() {

  const buttons: Button[]=[
    {bgImage: `url(${process.env.PUBLIC_URL}/images/masters.png)`, onClick:()=>{
    },
    hoverText: 'Use Masters Database'},
    {bgImage: `url(${process.env.PUBLIC_URL}/images/lichess.png)`, onClick:()=>{

    },
    hoverText: 'Use Lichess Database'}
  ]
  return (
    <div className={styles.parent}>
      {
        buttons.map((button:Button, key:number)=>{

          return <OptionButton button={button} isHighlighted={true}/>
        })
      }
    </div>
  )
}
