import React, { FormEventHandler, useEffect, useRef, useState } from 'react'
import TextField from '@mui/material/TextField';
import styles from '../styles/SetFen.module.css'
import { Chess } from 'chess.js';

export default function SetFen() {

  const inputRef=useRef<null|HTMLInputElement>(null)
  const [text, setText]=useState('')
  const [underlineColor, setUnderlineColor]=useState<'white'|'red'>('white')
 
  /**
   * called when form receives input
   * @param event 
   */
  function handleOnInput(event:any){
    
    const inputElement = inputRef.current
    if (inputElement){
      const inputValue = inputElement.value
      setText(inputValue)
    }
  }

  function isValidFen(potentialFen:string){
    try{
      new Chess(potentialFen)
    }
    catch (err){
      return false
    }
    return true
  }

  useEffect(()=>{
    if (text=='' || isValidFen(text)){
      setUnderlineColor('white')
    }
    else{
      setUnderlineColor('red')
    }
  }, [text])

  return (
    <div className={styles.container}>
      <p>Starting FEN:</p>
      <input style={{borderBottom: `1px solid ${underlineColor}`}} 
      ref={inputRef} onInput={handleOnInput}/>
    </div>
  )
}
