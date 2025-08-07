import styles from './InfoLayout.module.scss'
import WinrateBar from '../../Winrate/WinrateBar'
import { useContext, useEffect, useState } from 'react'
import DatabaseAPI from '../../../api/DatabaseAPI'
import { BoardContext, SettingsContext } from '../../../App'
import Winrate from '../../../classes/Winrate'
import { IconButton } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function InfoLayout() {

    const [openingName, setOpeningName] = useState<string>('')
    const [numGamesInDB, setNumGamesInDB] = useState<number>(0)
    const [numPossibleMoves, setNumPossibleMoves] = useState<number>(0)
    const [winrate, setWinrate] = useState<Winrate>(new Winrate(0, 0))

    const {database} = useContext(SettingsContext)!
    const {fen} = useContext(BoardContext)!

    useEffect(()=>{

        DatabaseAPI.getInstance().getPositionInfo(fen, database)
        .then(response=>{

            const openingName = response.openingName
            if (openingName){
                setOpeningName(openingName)
            }
            setNumGamesInDB(response.numGamesInDatabase)
            setNumPossibleMoves(response.numPossibleMoves)
            setWinrate(response.winrate)
        })
 

    }, [fen])

    function prettyPrintNumber(num:number):string{
        const formatter=Intl.NumberFormat('en', {notation: 'compact'})
        return formatter.format(num)
    }

    function onClickCopyFen(){
        navigator.clipboard.writeText(fen)  
    }
    

    return (
        <div className={styles.main}>

            <div className={styles.openingName}>
                {openingName}
                <div className={styles.winrateBarContainer}>
                    <WinrateBar winrate={winrate}/>
                </div>
            </div>

            <div className={styles.separator}/>

            <div className={styles.dbInfo}>

                <div className={styles.numGamesInDB}>
                    {prettyPrintNumber(numGamesInDB!)}  game(s) in database
                </div>

      
                •

                <div className={styles.numMovesInDB}>
                    {numPossibleMoves} possible move(s) in database
                </div>

            </div>

            <div className={styles.separator}/>

            <div>
                Copy Current FEN
                <IconButton onClick={onClickCopyFen} sx={{color: 'white','&:hover': {backgroundColor: '#545454'}}}>
                    <ContentCopyIcon sx={{fill: 'white'}}/>
                </IconButton> 
            </div>
        </div>
    )
}
