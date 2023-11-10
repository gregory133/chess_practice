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
import MoveList from './classes/MoveList';

function App() {

  const moveList=useChessStore(state=>state.moveList)  
  const addMove=useChessStore(state=>state.addMoveToMoveList)
  const navigateBack=useChessStore(state=>state.navigateMoveListBackward)
  const boardParentRef=useRef(null)

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
