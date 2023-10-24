import React, { useRef, useState } from 'react';
import Board from './components/Board';
import './styles/App.css'
import * as cg from 'chessground/types.js';
import { Move } from 'chess.js';

function App() {

  const divRef=useRef(null)

  function afterMove(newFen:string, previousMove:Move){
    console.log(newFen, previousMove);
  }

  return (
    <div ref={divRef} style={{width: '100vw', height: '100vh'}}>
      <Board parentRef={divRef} lastMove={undefined} 
      fen={'8/2k2P2/4PP2/8/8/8/3K4/8 w - - 0 1'} 
      colorPlayerCanControl={'white'} 
      orientation='white'
       afterMove={afterMove} />
    </div>
   
  );
}

export default App;
