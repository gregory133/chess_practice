import React, { useState } from 'react'
import styles from './SettingsLayout.module.scss'
import { useChessStore } from '../../../stores/chessStore'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material'

export default function SettingsLayout() {
    
    const selectedColor = useChessStore(state=>state.selectedColor)
    const setSelectedColor = useChessStore(state=>state.setSelectedColor)
    const [isResetButtonHovered, setIsResetButtonHovered] = useState(false)


    const reset = useChessStore(state=>state.reset)

    function onClickResetButton(){
        reset()
    }

    function onChangeSelectedColor(event:any){
        setSelectedColor(event.target.value)
    }
        
    return (
        <div className={styles.main}>

            <div className={styles.reset} style={{
                backgroundColor: isResetButtonHovered ? '#545454' : '#26241e'
            }} onMouseEnter={()=>setIsResetButtonHovered(true)}
            onMouseLeave={()=>setIsResetButtonHovered(false)} onClick={onClickResetButton}>
                Reset Position
                <div className={styles.resetImage}/>
            </div>

            <div className={styles.colorSelect}>
                Play As:<br/>

                 <RadioGroup sx={{
                        '& .MuiRadio-root' : {
                            color: 'white'
                        }
                    }}   
                    value={selectedColor}
                    onChange={onChangeSelectedColor}
                >
                    <FormControlLabel value="white" control={<Radio />} label="White" />
                    <FormControlLabel value="random" control={<Radio />} label="Random" />
                    <FormControlLabel  value="black" control={<Radio />} label="Black" />
                </RadioGroup>
                
            </div>
            
        </div>
    )
}
