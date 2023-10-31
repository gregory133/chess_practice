import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import WinrateBar from './components/WinrateBar';
import Winrate from './classes/Winrate';
import './styles/Index.css'
import Sidebar from './components/Sidebar';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(

  <App/>
  
);