import React, { useEffect, useState } from 'react'
import Chessground from '@react-chess/chessground';
import { Config } from 'chessground/config';
import "../styles/chessground.base.scss";
import "../styles/chessground.brown.scss";
import "../styles/chessground.cburnett.scss";
import { Chess } from 'chess.js';

export default function Test() {

  function getConfig():Config{
    const fen='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    const turnColor=fen.split(' ')[1]=='w'
    ? 'white' : 'black'
  
  
    return {
      fen: fen,
      coordinates:false,
      turnColor: turnColor,
      lastMove: [],
      movable: {
        free: true,
       
      }
    
    }
  }

  console.log('render');
  return (
    <Chessground config={getConfig()} width={300} height={300}/> 
  )
}
