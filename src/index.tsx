import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './styles/Index.scss'
import MovesBar from './components/MovesBar/MovesBar';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  // null
  <App/> 
  // <MovesBar/>
  // <OpeningsSeachBar/>
);