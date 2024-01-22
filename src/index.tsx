import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/Index.scss'
import Stockfish from './classes/Stockfish';
import EvalBar from './components/EvalBar/EvalBar';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Stockfish.getEval('rn1qkbnr/ppp1pppp/3p4/8/3PP3/7b/PPP2PPP/RNBQKBNR w KQkq - 1 3')
// .then(e=>{
//   console.log(e)
// })

root.render(
  // null
  <App/>  
);