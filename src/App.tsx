import React, { useRef, useState } from 'react';
import Board from './components/Board';

function App() {

  const divRef=useRef(null)

  return (
    <div ref={divRef} style={{width: '90vw', height: '90vh'}}>
      <Board parentRef={divRef} lastMove={null} 
      fen={'2k5/8/8/8/8/8/8/2K5 w - - 0 1'} 
      isMovable={true} orientation='white'
       afterMove={()=>{}} />
    </div>
   
  );
}

export default App;
