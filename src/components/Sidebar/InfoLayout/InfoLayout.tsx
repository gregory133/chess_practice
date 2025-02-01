import React, { useEffect } from 'react'
import styles from './InfoLayout.module.scss'
import { useChessStore } from '../../../stores/chessStore'
import WinrateBar from '../WinrateBar/WinrateBar'

export default function InfoLayout() {

    const openingName=useChessStore(state=>state.openingName)
    const winrate=useChessStore(state=>state.winrate)
    const numGamesInDB=useChessStore(state=>state.numGamesInDB)
    const numMovesInDB=useChessStore(state=>state.numMovesInDB)

    function prettyPrintNumber(num:number):string{
        const formatter=Intl.NumberFormat('en', {notation: 'compact'})
        return formatter.format(num)
    }


    return (
        <div className={styles.main}>
            <div className={styles.openingName}>
                {openingName}
                <div className={styles.winrateBarContainer}>
                    <WinrateBar winrate={winrate}/>
                </div>
            </div>
            <div className={styles.dbInfo}>

                <div className={styles.numGamesInDB}>
                    {prettyPrintNumber(numGamesInDB!)}  game(s) in database
                </div>
                
                •

                <div className={styles.numMovesInDB}>
                    {numMovesInDB} possible move(s) in database
                </div>

            </div>
        </div>
    )
}
