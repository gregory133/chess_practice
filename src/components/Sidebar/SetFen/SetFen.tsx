import React, { FormEventHandler, useEffect, useRef, useState } from 'react'
import TextField from '@mui/material/TextField';
import styles from './SetFen.module.scss'
import { Chess } from 'chess.js';
import { useChessStore } from '../../../stores/chessStore';

export default function SetFen() {

  const INITIAL_FEN='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  const COPY_BUTTON_HOVERED_COLOR='#BCBCBC'

  const inputRef=useRef<null|HTMLInputElement>(null)
  const [text, setText]=useState('')
  const [underlineColor, setUnderlineColor]=useState<'white'|'red'>('white')
  const [isCopyButtonHovered, setIsCopyButtonHovered]=useState<boolean>(false)

  const currentFen=useChessStore(state=>state.currentFen)
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

  /**
   * 
   * @returns the styles for the copyButton img object
   */
  function getCopyButtonStyle():React.CSSProperties{
    let bgColor=!isCopyButtonHovered ? 'transparent' : COPY_BUTTON_HOVERED_COLOR

    return {
      backgroundColor: bgColor
    }
  }

  /**
   * called when the copy button is clicked
   */
  function onClickCopyButton(){
    navigator.clipboard.writeText(currentFen)
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

        <div className={styles.copyButton} title='Copy current FEN' style={getCopyButtonStyle()} 
            onClick={onClickCopyButton}
            onMouseEnter={()=>setIsCopyButtonHovered(true)} onMouseLeave={()=>setIsCopyButtonHovered(false)}>
          <div className={styles.copyButtonIcon}/>
        </div>
        
    </div>
  )
}
