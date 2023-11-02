import React, { useEffect, useRef, useState } from 'react';
import Board from './components/Board';

import * as cg from 'chessground/types.js';
import { Chess, Move } from 'chess.js';
import TrainingModeStrategy from './interfaces/TrainingModeStrategy';
import HumanVSDB from './classes/trainingModes/HumanVSDB';
import Sidebar from './components/Sidebar';

import styles from './styles/App.module.css'
import './styles/Colors.css'
import './styles/Fonts.css'

import Winrate from './classes/Winrate';
import RefreshButton from './components/RefreshButton';

function App() {

  const INITIAL_FEN='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  const [startingFen, setStartingFen]=useState<string>(INITIAL_FEN)
  const [numGamesInDB, setNumGamesInDB]=useState<number|null>(null)
  const [numMovesInDB, setNumMovesInDB]=useState<number|null>(null)
  const [winrate, setWinrate]=useState<Winrate|null>(null)
  const [openingName, setOpeningName]=useState<string>('')
  const [orientation, setOrientation]=useState<'black'|'white'>('white')
  const [currentFen, setCurrentFen]=useState<string>(INITIAL_FEN)
  const currentFenRef=useRef<string>(currentFen)
  const [colorPlayerCanControl, setColorPlayerCanControl]=
  useState<'white'|'black'|null>('white')
  const [currentTrainingModeStrategy, setCurrentTrainingModeStrategy]=
  useState<TrainingModeStrategy>(new HumanVSDB(makeEngineMove, 'lichess',
  setOpeningName, setWinrate, setNumGamesInDB, setNumMovesInDB))
  const boardParentRef=useRef(null)

  
  useEffect(()=>{
    onStart()
  }, [])

  /**
   * function that must be ran everytime the application is created
   * or reset
   */
  function onStart(){
    const {fen, colorPlayerCanControl, orientation, canPlayerMove, onInit
    }=currentTrainingModeStrategy.initialValues; 

    currentFenRef.current=fen
    setColorPlayerCanControl(colorPlayerCanControl)
    setOrientation(orientation)
    onInit()  
  }

  /**
   * callback function that is run after a human player makes a move on the 
   * chess board
   * @param newFen 
   * @param previousMove 
   */
  function afterMove(newFen:string, previousMove:Move){
    currentFenRef.current=newFen
    currentTrainingModeStrategy?.afterPlayerMove(newFen, previousMove);
  }

  /**
   * function to be called to allow the engine to make the given move
   * @param san 
   */
  function makeEngineMove(san:string){
    let chess:Chess=new Chess(currentFenRef.current)
    chess.move(san)
    setCurrentFen(chess.fen())
    const previousMove:Move=chess.history({verbose:true})[chess.history().length-1]
    currentTrainingModeStrategy.afterEngineMove(chess.fen(), previousMove)
  }

  /**
   * resets every state variable of the board with the position indicated by startingFen
   */
  function resetBoard(){
    setCurrentFen(startingFen)
    setNumGamesInDB(null)
    setNumMovesInDB(null)
    setWinrate(null)
    setOpeningName('')
    onStart()
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.boardParent} ref={boardParentRef}>
        <Board parentRef={boardParentRef} lastMove={undefined} 
        fen={currentFen} 
        colorPlayerCanControl={colorPlayerCanControl} 
        orientation={orientation}
        afterMove={afterMove} />
      </div> 
      <RefreshButton onClick={resetBoard}/>
      <Sidebar setStartingFen={setStartingFen} numGamesInDB={numGamesInDB} 
      numMovesInDB={numMovesInDB}
       winrate={winrate} openingName={openingName}/>
    </div>
   
  );
}

export default App;
