import React, { useEffect, useRef, useState } from 'react'
import { useChessStore } from '../../stores/chessStore'

export interface Eval{
  value:number
  type:'cp'|'mate'
}

export interface Evaluation{
  eval:Eval, 
  bestMove:string
}


export default function () {

  const [isReady, setIsReady]=useState(false)

  const currentFen=useChessStore(state=>state.currentFen)
  const setEvaluation=useChessStore(state=>state.setEvaluation)

  const currentFenRef=useRef(currentFen)
  const stockfishRef=useRef<Worker>(new Worker('/stockfish.js'))

  useEffect(()=>{
    initializeStockfish()
    createNewStockfishGame()
  }, [])

  useEffect(()=>{
    console.log(currentFen)
    currentFenRef.current=currentFen
    stockfishRef.current.postMessage('stop')
   
  }, [currentFen])

  useEffect(()=>{
    if (isReady){
      ponderCurrentPostion()
    }
  }, [isReady])

  /**
   * called once to initialize Stockfish
   */
  function initializeStockfish(){
    stockfishRef.current.onmessage=onStockfishMessage
    stockfishRef.current.postMessage('uci')
    
  }

  /**
   * called to reset stockfish with the starting position in a new game
   */
  function createNewStockfishGame(){
    stockfishRef.current.postMessage('ucinewgame')
    stockfishRef.current.postMessage(`position startpos`)
    stockfishRef.current.postMessage('isready')
  }

  function extractEvaluation(msg:string):Evaluation{
    const bestMove=msg.split(' pv ')[1].split(' ')[0]
    const evaluation=msg.split(' cp ')[1].split(' ')[0]

    const evalValue:Eval={value: Number.parseInt(evaluation), type: 'cp'}
    return {eval:evalValue, bestMove: bestMove} as Evaluation
  }

  function ponderCurrentPostion(){
    stockfishRef.current.postMessage('go infinite')
  }

  function onStockfishMessage(event:any){
    
    const msg:string=event.data
    if (msg=='readyok'){
      setIsReady(true)
    }
    if (msg.includes('info depth')){
      const evaluation=extractEvaluation(msg)
      setEvaluation(evaluation)
    }
    if (msg.includes('ponder')){
      stockfishRef.current.postMessage(`position fen ${currentFenRef.current}`)
      stockfishRef.current.postMessage('go infinite')
    }

  }

  return (
    null
  )
}
