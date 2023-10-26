import React, { useEffect, useRef, useState } from 'react';
import Board from './components/Board';
import './styles/App.css'
import * as cg from 'chessground/types.js';
import { Move } from 'chess.js';
import { fetchMastersDB, getSanListFromMasterDB } from './api/mastersDBApi';

function App() {

  const divRef=useRef(null)

  function afterMove(newFen:string, previousMove:Move){
    // console.log(newFen, previousMove);
  }

  useEffect(()=>{
    fetchMastersDB('rn1qk2r/1p2bppp/p2pbn2/4p3/4P3/1NN1BP2/PPPQ2PP/R3KB1R b KQkq - 2 9')
    .then(json=>{
      console.log(getSanListFromMasterDB(json));
    })
  }, [])

  return (
    <div ref={divRef} style={{width: '100vw', height: '100vh'}}>
      <Board parentRef={divRef} lastMove={undefined} 
      fen={'rn1qk2r/1p2bppp/p2pbn2/4p3/4P3/1NN1BP2/PPPQ2PP/R3KB1R b KQkq - 2 9'} 
      colorPlayerCanControl={'black'} 
      orientation='white'
       afterMove={afterMove} />
    </div>
   
  );
}

export default App;
