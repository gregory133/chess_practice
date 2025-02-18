import styles from './InfoLayout.module.scss'
import WinrateBar from '../../Winrate/WinrateBar'

export default function InfoLayout() {


    function prettyPrintNumber(num:number):string{
        const formatter=Intl.NumberFormat('en', {notation: 'compact'})
        return formatter.format(num)
    }


    return (
        <div className={styles.main}>
            <div className={styles.openingName}>
                Caro Kann
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
