import { IonIcon } from '@ionic/react'
import React from 'react'
import styles from './ButtonsBar.module.scss'
import Button from './ButtonsBarButtonComponent/ButtonsBarButtonComponent'
import ButtonsBarButtonComponent from './ButtonsBarButtonComponent/ButtonsBarButtonComponent'
import { useChessStore } from '../../stores/chessStore'

export interface ButtonsBarButton{
  iconImgPath:string
  hoverHintText:string
  onClick: ()=>void
}

export default function ButtonsBar() {

  const reset=useChessStore(state=>state.reset)

  let buttons:ButtonsBarButton[]=[
    {
      iconImgPath: '/images/reset.png',
      hoverHintText: 'Reset Position',
      onClick: reset
    },

    {
      iconImgPath: '/images/small_board.png',
      hoverHintText: 'Load Opening',
      onClick: ()=>{}
    },

    {
      iconImgPath: '/images/user.png',
      hoverHintText: 'Load Player',
      onClick: ()=>{}
    }
  ]

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
