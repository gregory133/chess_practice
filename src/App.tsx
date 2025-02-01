import React, { useEffect, useRef, useState } from 'react';
import Board from './components/Board/Board';
import Sidebar from './components/Sidebar/Sidebar';

import './styles/Colors.scss'
import './styles/Fonts.scss'

import { useChessStore } from './stores/chessStore';
import { useMediaQuery } from 'react-responsive'
import Navbar from './components/Navbar/Navbar';
import LandscapeLayout from './components/Layouts/LandscapeLayout/LandscapeLayout';
import Portrait from './components/Layouts/PortraitLayout/PortraitLayout';
import PortraitLayout from './components/Layouts/PortraitLayout/PortraitLayout';
import PlayerGameDownloader from './api/PlayerGameDownloader';

function App() {
  const evaluation=useChessStore(state=>state.evaluation)
  const navigateBackward=useChessStore(state=>state.navigatePositionListBackward)
  const navigateForward=useChessStore(state=>state.navigatePositionListForward)
  const setIsStockfishArrowActive=useChessStore(state=>state.setIsStockfishArrowActive)
  const boardParentRef=useRef(null)

  const isLandscape = useMediaQuery({
    query : '(min-aspect-ratio: 4/5)'
  })

  useEffect(()=>{
    new PlayerGameDownloader().downloadGames({
      username: 'greg133', color: 'white', fen: 'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2'})
    .then(o=>{
      console.log(o)
    })
  }, [])

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

  // useEffect(()=>{
  //   console.log(isLandscape)
  // }, [isLandscape])

  return (
    <>
      {
        isLandscape
          ? <LandscapeLayout/>
          : <PortraitLayout/> 
      }
    </>
    
    
  )
}

export default App;
