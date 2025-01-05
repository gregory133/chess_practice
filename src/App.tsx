import React, { useEffect, useRef, useState } from 'react';
import Board from './components/Board/Board';
import Sidebar from './components/Sidebar/Sidebar';

import styles from './styles/App.module.scss'
import './styles/Colors.scss'
import './styles/Fonts.scss'

import { useChessStore } from './stores/chessStore';
import EvalBar from './components/EvalBar/EvalBar';
import MaterialCount from './components/EvalBar/MaterialCount/MaterialCount';
import StockfishComponent from './components/Stockfish/StockfishComponent';
import ButtonsBar from './components/ButtonsBar/ButtonsBar';
import Navbar from './components/Navbar/Navbar';

function App() {
  const evaluation=useChessStore(state=>state.evaluation)
  const navigateBackward=useChessStore(state=>state.navigatePositionListBackward)
  const navigateForward=useChessStore(state=>state.navigatePositionListForward)
  const setIsStockfishArrowActive=useChessStore(state=>state.setIsStockfishArrowActive)
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
    setIsStockfishArrowActive(false)
  }

   /**
   * called when the right arrow key is pressed
   */
  function onRightArrowKeyPressed(){
    navigateForward()
  }

  return (

    <div className={styles.main}>
      <Navbar/>
      <div className={styles.container}>
        <div className={styles.boardParent} ref={boardParentRef}>
          <Board parentRef={boardParentRef}/>
        </div>
        <div className={styles.bar}>
          <EvalBar/>
          <MaterialCount/>
        </div>
        
        <Sidebar/>
        {/* <StockfishComponent/> */}
      </div>
    </div>
    
  
   
  );
}

export default App;
