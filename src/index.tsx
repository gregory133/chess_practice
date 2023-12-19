import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/Index.scss'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  // <EvalBar evaluation={{type: 'cp', value: 0} as Eval} isWhiteAtBottom={false}/>
  <App/>  
);