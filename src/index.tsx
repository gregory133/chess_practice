import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './styles/Index.scss'
import EvalBar from './components/EvalBar/EvalBar';
import PositionList from './classes/PositionList';
import Position from './classes/Position';
import PlayerGameDownloader from './api/PlayerGameDownloader';
import PlayerDatabase from './classes/PlayerDatabase';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const downloader = new PlayerGameDownloader().downloadGames('greg133', 
  {color: 'white', timeControls: ['rapid'], maxNumber: 200})

// const tree = new PlayerDatabase()
// tree.addGameOutcome(['e4', 'e5', 'Nf3', 'Nc6'], 'win')
// tree.addGameOutcome(['e4', 'c5', 'Nf3', 'Nc6'], 'draw')

// console.log(tree.toString())


root.render(
  // <App/> 
  null
);