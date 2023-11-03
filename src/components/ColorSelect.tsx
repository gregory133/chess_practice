import React from 'react'
import styles from '../styles/ColorSelect.module.css'

interface Button{
  bgImage: string,
  onClick:()=>void,
  hoverText: string
}

export default function ColorSelect() {

  const buttons: Button[]=[
    {bgImage: `url(${process.env.PUBLIC_URL}/images/white.png)`, onClick:()=>{},
    hoverText: 'Play as White'},
    {bgImage: `url(${process.env.PUBLIC_URL}/images/blackwhite.png)`, onClick:()=>{},
    hoverText: 'Play as Any Color'},
    {bgImage: `url(${process.env.PUBLIC_URL}/images/black.png)`, onClick:()=>{},
    hoverText: 'Play as Black'},
  ]

  return (
    <div className={styles.parent}>
      <div className={styles.container}>

        {
          buttons.map((button:Button, key:number)=>{

            return (
              <div key={key} className={styles.button}>
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
