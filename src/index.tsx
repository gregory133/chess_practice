import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/Index.scss'
import Stockfish from './classes/Stockfish';
import EvalBar from './components/EvalBar/EvalBar';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  // <EvalBar />
  <App/>  
);