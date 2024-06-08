import { IonIcon } from '@ionic/react'
import React from 'react'
import styles from './ButtonsBar.module.scss'
import Button from './ButtonsBarButtonComponent/ButtonsBarButtonComponent'
import ButtonsBarButtonComponent from './ButtonsBarButtonComponent/ButtonsBarButtonComponent'

export interface ButtonsBarButton{
  iconImgPath:string
  hoverHintText:string
  onClick: ()=>void
}

export default function ButtonsBar() {

  let buttons:ButtonsBarButton[]=[
    {
      iconImgPath: '/images/reset.png',
      hoverHintText: 'Reset Position',
      onClick: onClickReset
    },

    {
      iconImgPath: '/images/reset.png',
      hoverHintText: 'Reset Position',
      onClick: onClickReset
    },

    {
      iconImgPath: '/images/reset.png',
      hoverHintText: 'Reset Position',
      onClick: onClickReset
    }
  ]

  function onClickReset(){

  }

  

  return (
    <div className={styles.main}>
       {
        buttons.map((button:ButtonsBarButton, key:number)=>{
          return <ButtonsBarButtonComponent key={key} button={button}/>
        })
       }
    </div>
  )
}
