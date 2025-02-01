import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './styles/Index.scss'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// document.documentElement.style.fontSize = '5px'


root.render(
  // null
  <App/> 
  // <Navbar/>
  // <OpeningsSeachBar/>
);