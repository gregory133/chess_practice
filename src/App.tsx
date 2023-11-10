import React, { useEffect, useRef, useState } from 'react';
import Board from './components/Board';

import * as cg from 'chessground/types.js';
import { Chess, Move } from 'chess.js';
import Sidebar from './components/Sidebar';

import styles from './styles/App.module.css'
import './styles/Colors.css'
import './styles/Fonts.css'

import Winrate from './classes/Winrate';
import RefreshButton from './components/RefreshButton';
import { useChessStore } from './stores/chessStore';
import Stockfish, { Eval } from './classes/Stockfish';

import LinkedList from 'dbly-linked-list'
import MoveList from './classes/PositionList';

function App() {
  const positionList=useChessStore(state=>state.positionList)  
  const addPosition=useChessStore(state=>state.addPositionToPositionList)
  const navigateBackward=useChessStore(state=>state.navigatePositionListBackward)
  const navigateForward=useChessStore(state=>state.navigatePositionListForward)
  const boardParentRef=useRef(null)

  useEffect(()=>{
    hookupArrowKeyEvents()
  }, [])

  /**
   * hooks the arrow key press events. must be called once inside useEffect
   */
  function hookupArrowKeyEvents(){
    document.addEventListener('keydown', function(event){
      if (event.key=='ArrowLeft'){
        onLeftArrowKeyPressed()
      }
      else if (event.key=='ArrowRight'){
        onRightArrowKeyPressed()
      }
    })
  }

  /**
   * called when the left arrow key is pressed
   */
  function onLeftArrowKeyPressed(){
    navigateBackward()
  }

   /**
   * called when the right arrow key is pressed
   */
  function onRightArrowKeyPressed(){
    navigateForward()
  }

  

  return (
    <div className={styles.container}>
      <div className={styles.boardParent} ref={boardParentRef}>
        <Board parentRef={boardParentRef}/>
      </div> 
      <RefreshButton/>
      <Sidebar/>
    </div>
   
  );
}

export default App;
