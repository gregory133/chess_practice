import React from 'react'
import styles from '../styles/OptionButton.module.css'

interface Props{
  button: Button,
  border: string,
}

export interface Button{
  bgImage: string,
  onClick:()=>void,
  hoverText: string
}

export default function OptionButton(props:Props) {

  return (
    <div title={props.button.hoverText} className={styles.button} 
    style={{border: props.border}} onClick={props.button.onClick}>
      <div className={styles.buttonImage} style={{
        backgroundImage: props.button.bgImage
      }}/>
    </div>
  )
}
