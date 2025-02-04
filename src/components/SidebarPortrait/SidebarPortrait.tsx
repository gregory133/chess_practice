import React from 'react'
import styles from './SidebarPortrait.module.scss'
import { useChessStore } from '../../stores/chessStore'

export default function SidebarPortrait() {

    let openingName = useChessStore(state=>state.openingName)
    const numGamesInDB = useChessStore(state=>state.numGamesInDB)
    const numMovesInDB=useChessStore(state=>state.numMovesInDB)
    const winrate=useChessStore(state=>state.winrate)

    openingName = 'Sicilian Defense'

    return (
        <div className={styles.main}>
            <div className={styles.openingName}>
                {openingName}
            </div>
            <div className={styles.moveStats}>
                {
                // (numGamesInDB && numMovesInDB && winrate) 
                //     ? (<MoveStats numGamesInDB={numGamesInDB} 
                //     numMovesInDB={numMovesInDB}/>)
                //     : <div className={styles.noMoreGame}>There are no more Games in the Database</div>
                }
            </div>
            <div className={styles.colorSelect}>

            </div>
        </div>
    )
}
