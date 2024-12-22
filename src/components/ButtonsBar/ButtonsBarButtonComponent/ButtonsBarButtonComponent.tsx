import React, { useState } from 'react'
import { ButtonsBarButton } from '../ButtonsBar'
import styles from './ButtonsBarButtonComponent.module.scss'

interface Props{
  button:ButtonsBarButton
  key:number
}

export default function ButtonsBarButtonComponent(props:Props) {

  const [hovered, setHovered]=useState(false)
  const hoveredBg='#262421'
  const notHoveredBg='#302E2C'

  return (
    <img src={`${process.env.PUBLIC_URL}${props.button.iconImgPath}`} 
    onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
    onClick={props.button.onClick}
    className={styles.button} title={props.button.hoverHintText}
    style={{
      // backgroundImage: `url('${process.env.PUBLIC_URL}${props.button.iconImgPath}')`,
  
      backgroundColor: hovered ? hoveredBg : notHoveredBg
    }}></img>
  )
}
