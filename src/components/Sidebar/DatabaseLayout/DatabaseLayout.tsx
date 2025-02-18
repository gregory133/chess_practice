import { useState } from 'react'
import styles from './DatabaseLayout.module.scss'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material'

export default function DatabaseLayout() {

    const [selectedVal, setSelectedVal] = useState<'masters' | 'lichess'>('masters')

    function onChangeSelectedDatabase(event:any){
        const newVal = event.target.value
        setSelectedVal(newVal)
    }

    return (
        <div className={styles.main}>
            
            <RadioGroup sx={{
                    '& .MuiRadio-root' : {
                        color: 'white'
                    }
                }}   
                value={selectedVal}
                onChange={onChangeSelectedDatabase}
            >
                <FormControlLabel value="lichess" control={<Radio />} label="Lichess Database" />
                <FormControlLabel value="masters" control={<Radio />} label="Masters Database" />
                {/* <FormControlLabel  value="player" control={<Radio />} label="Lichess Player" /> */}
            </RadioGroup>

        </div>
    )
}
