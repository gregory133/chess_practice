import { useContext, useEffect, useState } from 'react'
import styles from './DatabaseLayout.module.scss'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { BoardContext, SettingsContext } from '../../../App'

export default function DatabaseLayout() {

    const {database, setDatabase} = useContext(SettingsContext)!

    function onChangeSelectedDatabase(event:any){
        const newVal = event.target.value as 'lichess' | 'masters'
        setDatabase(newVal)
    }

    return (
        <div className={styles.main}>
            
            <RadioGroup sx={{
                    '& .MuiRadio-root' : {
                        color: 'white'
                    }
                }}   
                value={database}
                onChange={onChangeSelectedDatabase}
            >
                <FormControlLabel value="lichess" control={<Radio />} label="Lichess Database" />
                <FormControlLabel value="masters" control={<Radio />} label="Masters Database" />
                {/* <FormControlLabel  value="player" control={<Radio />} label="Lichess Player" /> */}
            </RadioGroup>

        </div>
    )
}
