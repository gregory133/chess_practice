import React, { useState } from 'react'
import styles from './ColorSelect.module.scss'
import { useChessStore } from '../../stores/chessStore'
import { Dictionary } from 'typescript-collections'
import OptionButton, { Button } from '../OptionsButton/OptionButton'

type Color='white'|'any'|'black'

export default function ColorSelect() {

  const selectedColor=useChessStore(state=>state.selectedColor)
  const [selectedId, setSelectedId]=useState<string>(selectedColor)
  const setSelectedColor=useChessStore(state=>state.setSelectedColor)

  const buttons: Button[]=[
    {id: 'white', bgImage: `${process.env.PUBLIC_URL}/images/white.png`, 
    onClick:()=>{onClickChooseColorButton('white')},
    hoverText: 'Play as White'},

    {id: 'any', bgImage: `${process.env.PUBLIC_URL}/images/blackwhite.png`, 
    onClick:()=>{onClickChooseColorButton('any')},
    hoverText: 'Play as random Color'},

    {id: 'black', bgImage: `${process.env.PUBLIC_URL}/images/black.png`, 
    onClick:()=>{onClickChooseColorButton('black')},
    hoverText: 'Play as Black'},
  ]

  function onClickChooseColorButton(color:Color){
    setSelectedId(color)
    setSelectedColor(color)
  }

  return (
    <div className={styles.parent}>
      <p>Play as:</p>
      <div className={styles.container}>

        {
          buttons.map((button:Button, key:number)=>{
            return (
              <OptionButton button={button} key={key} 
              isHighlighted={button.id==selectedId}/>
            )
          })
        }

      </div>
    </div>
    
  )
}
