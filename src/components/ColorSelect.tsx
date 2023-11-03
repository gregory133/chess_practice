import React, { useState } from 'react'
import styles from '../styles/ColorSelect.module.css'
import { useChessStore } from '../stores/chessStore'
import { Dictionary } from 'typescript-collections'
import OptionButton, { Button } from './OptionButton'

enum Color{
  WHITE, ANY, BLACK
}

export default function ColorSelect() {

  const [selectedIndex, setSelectedIndex]=useState<Color>(Color.ANY)
  const setSelectedColor=useChessStore(state=>state.setSelectedColor)
  const colorDict=new Dictionary<Color, 'white'|'any'|'black'>()

  initializeColorDict()

  const buttons: Button[]=[
    {bgImage: `url(${process.env.PUBLIC_URL}/images/white.png)`, onClick:()=>{
      onClickChooseColorButton(Color.WHITE)
    },
    hoverText: 'Play as White'},
    {bgImage: `url(${process.env.PUBLIC_URL}/images/blackwhite.png)`, onClick:()=>{
      onClickChooseColorButton(Color.ANY)
    },
    hoverText: 'Play as Any Color'},
    {bgImage: `url(${process.env.PUBLIC_URL}/images/black.png)`, onClick:()=>{
      onClickChooseColorButton(Color.BLACK)
    },
    hoverText: 'Play as Black'},
  ]

  function initializeColorDict(){
    colorDict.setValue(Color.WHITE, 'white')
    colorDict.setValue(Color.ANY, 'any')
    colorDict.setValue(Color.BLACK, 'black')
  }

  function onClickChooseColorButton(color:Color){
    setSelectedIndex(color)
    setSelectedColor(colorDict.getValue(color)!)
  }

  return (
    <div className={styles.parent}>
      <p className={styles.title}>Play as:</p>
      
      <div className={styles.container}>

        {
          buttons.map((button:Button, key:number)=>{
           

            return (
              <OptionButton button={button} key={key} 
              isHighlighted={selectedIndex==key }/>
            )
          })
        }

      </div>
    </div>
    
  )
}
