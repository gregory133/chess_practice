import React from 'react'
import styles from './Portrait.module.scss'
import Navbar from '../../Navbar/Navbar'
import Board from '../../Board/Board'



export default function Portrait() {
  return (
    <div className={styles.main}>
       <Navbar/>
       <Board/>
     
    </div>
  )
}
