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

  const MOVE_TIME=0
  const [isReady, setIsReady]=useState(false)

  const currentFen=useChessStore(state=>state.currentFen)
  const setEvaluation=useChessStore(state=>state.setEvaluation)

  const stockfishRef=useRef<Worker|null>(null)

  useEffect(()=>{
    stockfishRef.current=new Worker('/stockfish.js')
    initializeStockfish()
    createNewStockfishGame()
  }, [])

  useEffect(()=>{
    if (stockfishRef.current){
      stockfishRef.current.postMessage('stop')
      stockfishRef.current.postMessage(`position fen ${currentFen}`)
      stockfishRef.current.postMessage(`go infinite`)
    }
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
    if (stockfishRef.current){
      stockfishRef.current.onmessage=onStockfishMessage
      stockfishRef.current.postMessage('uci')
    }
  }

  /**
   * called to reset stockfish with the starting position in a new game
   */
  function createNewStockfishGame(){
    if (stockfishRef.current){
      stockfishRef.current.postMessage('ucinewgame')
      stockfishRef.current.postMessage(`position startpos`)
      stockfishRef.current.postMessage('isready')
    }
    
  }

  function extractEvaluation(msg:string):Evaluation{
    const bestMove=msg.split(' pv ')[1].split(' ')[0]
    const evaluation=msg.split(' cp ')[1].split(' ')[0]

    const evalValue:Eval={value: Number.parseInt(evaluation), type: 'cp'}
    return {eval:evalValue, bestMove: bestMove} as Evaluation
  }

  function ponderCurrentPostion(){
    if (stockfishRef.current){
      stockfishRef.current.postMessage(`go infinite`)
    }
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
     
    }

  }

  return (
    null
  )
}
