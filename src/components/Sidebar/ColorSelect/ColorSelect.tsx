import React, { useState } from 'react'
import styles from './ColorSelect.module.scss'
import { useChessStore } from '../../../stores/chessStore'
import { Dictionary } from 'typescript-collections'
import OptionButton, { Button } from '../OptionsButton/OptionButton'

type Color='white'|'random'|'black'

export default function ColorSelect() {

  const selectedColor=useChessStore(state=>state.selectedColor)
  const [selectedId, setSelectedId]=useState<string>(selectedColor)
  const setSelectedColor=useChessStore(state=>state.setSelectedColor)

  const buttonNameDict = new Dictionary<string, string>();{
    buttonNameDict.setValue('white', 'White')
    buttonNameDict.setValue('random', 'Random Color')
    buttonNameDict.setValue('black', 'Black')
  }

  const buttons: Button[]=[
    {id: 'white', bgImage: `${process.env.PUBLIC_URL}/images/white.png`, 
    onClick:()=>{onClickChooseColorButton('white')},
    hoverText: 'Play as White'},

    {id: 'random', bgImage: `${process.env.PUBLIC_URL}/images/blackwhite.png`, 
    onClick:()=>{onClickChooseColorButton('random')},
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
              <div className={styles.button}>
                <OptionButton button={button} key={key} 
                isHighlighted={button.id==selectedId}/>
                <p className={styles.buttonText}>{buttonNameDict.getValue(button.id)}</p>
              </div>
              
            )
          })
        }

      </div>
    </div>
    
  )
}
