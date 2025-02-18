import React, { useEffect, useState } from 'react'
import styles from './DatabaseLayout.module.scss'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material'

export default function DatabaseLayout() {

    return (
        <div className={styles.main}>
            
            <RadioGroup sx={{
                    '& .MuiRadio-root' : {
                        color: 'white'
                    }
                }}   
                value={'masters'}
                // onChange={onChangeSelectedDatabase}
            >
                <FormControlLabel value="lichess" control={<Radio />} label="Lichess Database" />
                <FormControlLabel value="masters" control={<Radio />} label="Masters Database" />
                <FormControlLabel  value="player" control={<Radio />} label="Lichess Player" />
            </RadioGroup>

        </div>
    )
}
