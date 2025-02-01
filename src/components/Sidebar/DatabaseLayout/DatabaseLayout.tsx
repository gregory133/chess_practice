import React, { useEffect, useState } from 'react'
import styles from './DatabaseLayout.module.scss'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material'

export default function DatabaseLayout() {

    const [selectedDatabase, setSelectedDatabase] = useState<string>("lichess")

    function onChangeSelectedDatabase(event:any){
        setSelectedDatabase(event.target.value)
    }

    return (
        <div className={styles.main}>
            
            <RadioGroup sx={{
                    '& .MuiRadio-root' : {
                        color: 'white'
                    }
                }}   
                value={selectedDatabase}
                onChange={onChangeSelectedDatabase}
            >
                <FormControlLabel value="lichess" control={<Radio />} label="Lichess Database" />
                <FormControlLabel value="masters" control={<Radio />} label="Masters Database" />
                <FormControlLabel  value="lichess_player" control={<Radio />} label="Lichess Player" />
            </RadioGroup>

        </div>
    )
}
