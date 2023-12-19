import React from 'react'
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

  const shadow=props.isHighlighted
  ? ('0px 0px 10px green') 
  : ('0px 0px 10px transparent')

  return (
    <div title={props.button.hoverText} className={styles.button} 
    style={{
      boxShadow: shadow
    }} onClick={props.button.onClick}>
      <img src={props.button.bgImage}/>
    </div>
  )
}
