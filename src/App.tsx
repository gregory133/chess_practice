import React, { useEffect, useRef, useState } from 'react';
import Board from './components/Board/Board';
import Sidebar from './components/Sidebar/Sidebar';

import styles from './styles/App.module.scss'
import './styles/Colors.scss'
import './styles/Fonts.scss'

import RefreshButton from './components/RefreshButton/RefreshButton';
import { useChessStore } from './stores/chessStore';
import Stockfish, { Eval } from './classes/Stockfish';
import EvalBar from './components/EvalBar/EvalBar';
import MaterialCount from './components/MaterialCount/MaterialCount';

function App() {
  const navigateBackward=useChessStore(state=>state.navigatePositionListBackward)
  const navigateForward=useChessStore(state=>state.navigatePositionListForward)
  const setStockfishSuggestion=useChessStore(state=>state.setStockfishSuggestion)
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
    setStockfishSuggestion(null)
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
      <div className={styles.bar}>
        <EvalBar/>
        <MaterialCount/>
      </div>
      
      <RefreshButton/>
      <Sidebar/>
    </div>
   
  );
}

export default App;
