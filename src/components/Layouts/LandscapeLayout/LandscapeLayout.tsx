import React from 'react'
import Navbar from '../../Navbar/Navbar'
import Board from '../../Board/Board'
import EvalBar from '../../EvalBar/EvalBar'
import MaterialCount from '../../EvalBar/MaterialCount/MaterialCount'
import Sidebar from '../../Sidebar/Sidebar'
import StockfishComponent from '../../Stockfish/StockfishComponent'
import styles from './LandscapeLayout.module.scss'

interface Props{
    boardParentRef : React.MutableRefObject<null>
}

export default function LandscapeLayout(props:Props) {
  return (
    <div className={styles.main}>
        <Navbar/>
        <div className={styles.container}>
          <div className={styles.boardParent} ref={props.boardParentRef}>
            <Board parentRef={props.boardParentRef}/>
          </div>
          <div className={styles.bar}>
            <EvalBar/>
            <MaterialCount/>
          </div>
          
          <Sidebar/>
          <StockfishComponent/>
        </div>
    </div>
  )
}
