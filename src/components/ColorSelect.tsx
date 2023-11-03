import React, { useState } from 'react'
import styles from '../styles/ColorSelect.module.css'
import { useChessStore } from '../stores/chessStore'
import { Dictionary } from 'typescript-collections'

interface Button{
  bgImage: string,
  onClick:()=>void,
  hoverText: string
}

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
      <div className={styles.container}>

        {
          buttons.map((button:Button, key:number)=>{
            const border=selectedIndex==key 
              ? ('2px solid green') 
              : ('2px solid transparent')

            return (
              <div title={button.hoverText} key={key} className={styles.button} 
              style={{border: border}} onClick={button.onClick}>
                <div className={styles.buttonImage} style={{
                  backgroundImage: button.bgImage
                }}/>
              </div>
            ) 
          })
        }

      </div>
    </div>
    
  )
}
