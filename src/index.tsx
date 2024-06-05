import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/Index.scss'
import EvalBar from './components/EvalBar/EvalBar';
import PositionList from './classes/PositionList';
import Position from './classes/Position';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <App/> 
);