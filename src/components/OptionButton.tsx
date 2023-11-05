import React from 'react'
import styles from '../styles/OptionButton.module.css'

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

  const border=props.isHighlighted
  ? ('2px solid green') 
  : ('2px solid transparent')

  return (
    <div title={props.button.hoverText} className={styles.button} 
    style={{border: border}} onClick={props.button.onClick}>
      <div className={styles.buttonImage} style={{
        backgroundImage: props.button.bgImage
      }}/>
    </div>
  )
}
