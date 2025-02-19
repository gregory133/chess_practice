import styles from './InfoLayout.module.scss'
import WinrateBar from '../../Winrate/WinrateBar'
import { useContext, useEffect, useState } from 'react'
import DatabaseAPI from '../../../api/DatabaseAPI'
import { BoardContext } from '../../../App'

export default function InfoLayout() {

    const [openingName, setOpeningName] = useState<string>('')

    const {fen} = useContext(BoardContext)!

    useEffect(()=>{

        DatabaseAPI.getInstance().getPositionInfo(fen, 'masters')
        .then(response=>{

            const openingName = response.openingName
            if (openingName){
                setOpeningName(openingName)
            }

        })
 

    }, [fen])

    function prettyPrintNumber(num:number):string{
        const formatter=Intl.NumberFormat('en', {notation: 'compact'})
        return formatter.format(num)
    }
    

    return (
        <div className={styles.main}>
            <div className={styles.openingName}>
                {openingName}
                <div className={styles.winrateBarContainer}>
                    {/* <WinrateBar winrate={winrate}/> */}
                </div>
            </div>
            <div className={styles.dbInfo}>

                <div className={styles.numGamesInDB}>
                    {/* {prettyPrintNumber(numGamesInDB!)}  game(s) in database */}
                </div>
                
                •

                <div className={styles.numMovesInDB}>
                    {/* {numMovesInDB} possible move(s) in database */}
                </div>

            </div>
        </div>
    )
}
