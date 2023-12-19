import React, { useEffect, useState } from 'react'
import styles from '../styles/OptionButton.module.scss'

interface Props{
  button: Button,
  isHighlighted: boolean
}

export interface Button{
  id: string,
  bgImage: string,
  onClick:()=>void,
  hoverText: string
}

export default function OptionButton(props:Props) {

  const [isHovered, setIsHovered]=useState(false)

  return (
    <div onMouseEnter={()=>setIsHovered(true)} onMouseLeave={()=>setIsHovered(false)} 
    title={props.button.hoverText} className={styles.button} 
    style={{
      boxShadow: props.isHighlighted ? '0px 0px 10px white' : '0px 0px 10px transparent',
      backgroundColor: isHovered ? '#706F6D' : 'transparent'
    }} onClick={props.button.onClick}>
      <img src={props.button.bgImage}/>
    </div>
  )
}
