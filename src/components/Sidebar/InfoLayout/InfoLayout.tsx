import styles from './InfoLayout.module.scss'
import WinrateBar from '../../Winrate/WinrateBar'
import { useContext, useEffect, useState } from 'react'
import DatabaseAPI from '../../../api/DatabaseAPI'
import { BoardContext, SettingsContext } from '../../../App'
import Winrate from '../../../classes/Winrate'
import { IconButton } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function InfoLayout() {

    const [openingName, setOpeningName] = useState<string|null>(null)
    const [numGamesInDB, setNumGamesInDB] = useState<number|null>(null)
    const [numPossibleMoves, setNumPossibleMoves] = useState<number|null>(null)
    const [winrate, setWinrate] = useState<Winrate|null>(null)

    const {database} = useContext(SettingsContext)!
    const {fen} = useContext(BoardContext)!

    useEffect(()=>{
        console.log(openingName)
    }, [openingName])

    useEffect(()=>{
        DatabaseAPI.getInstance().getPositionInfo(fen, database)
        .then(response=>{

            if (response.openingName) setOpeningName(response.openingName); else if (!openingName) setOpeningName('')
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

    /**
     * returns true if the component has been fully rendered and contains proper values
     */
    function isComponentFullyLoaded() : boolean{
        return openingName!=null && numGamesInDB!=null && numPossibleMoves != null && winrate != null
    }

    return (
        <>
        {
            !isComponentFullyLoaded() ? null : (
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
                        <IconButton onClick={onClickCopyFen} sx={{color: 'white','&:hover': 
                            {backgroundColor: '#545454'}}}>
                            <ContentCopyIcon sx={{fill: 'white'}}/>
                        </IconButton> 
                    </div>
                </div>
            )
        }
        </>
        
        
    )
}
