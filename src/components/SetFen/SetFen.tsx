import React, { FormEventHandler, useEffect, useRef, useState } from 'react'
import TextField from '@mui/material/TextField';
import styles from './SetFen.module.scss'
import { Chess } from 'chess.js';
import { useChessStore } from '../../stores/chessStore';

export default function SetFen() {

  const INITIAL_FEN='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

  const inputRef=useRef<null|HTMLInputElement>(null)
  const [text, setText]=useState('')
  const [underlineColor, setUnderlineColor]=useState<'white'|'red'>('white')

  const setStartingFen=useChessStore(state=>state.setStartingFen)
 
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

  /**
   * calls props.setStartingFen with the given fen string.
   * @param fen fen string. If equal to the empty string, will be converted to
   * the initial position fen
   */
  function updateStartingFen(fen:string){
    if (fen==''){
      fen=INITIAL_FEN
    }
    setStartingFen(fen)
  }

  useEffect(()=>{
    if (text=='' || isValidFen(text)){
      setUnderlineColor('white')
      updateStartingFen(text)
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
