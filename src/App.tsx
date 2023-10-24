import React, { useRef, useState } from 'react';
import Board from './components/Board';
import './styles/App.css'
import * as cg from 'chessground/types.js';

function App() {

  const divRef=useRef(null)

  return (
    <div ref={divRef} style={{width: '100vw', height: '100vh'}}>
      <Board parentRef={divRef} lastMove={undefined} 
      fen={'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'} 
      colorPlayerCanControl={'white'} 
      orientation='white'
       afterMove={()=>{}} />
    </div>
   
  );
}

export default App;
