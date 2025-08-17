import { useContext, useRef, useState } from 'react'
import styles from './SettingsLayout.module.scss'
import { FormControlLabel, Icon, Radio, RadioGroup } from '@mui/material'
import { Chess } from 'chess.js'
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Button from '@mui/material/Button';
import { Delete } from '@mui/icons-material';
import { BoardContext } from '../../../App';
import { HIGHTLIGHTED_COLOR, HOVERED_COLOR, UNHIGHLIGHTED_COLOR } from '../../../classes/Constants';


export default function SettingsLayout() {

    const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    
    const [selectedColor, setSelectedColor] = useState<string>('random')

    const [isResetButtonHovered, setIsResetButtonHovered] = useState(false)
    const [isEditButtonHovered, setIsEditButtonHovered] = useState(false)

    const [isEditToggled, setIsEditToggled] = useState(false)
    const [inputUnderlineColor, setInputUnderlineColor] = useState<string>('white')

    const {reset, isEditModeActive, setIsEditModeActive} = useContext(BoardContext)!

    const fenInputRef = useRef<HTMLInputElement>(null)

    const formControlLabelSx = {
        "& .MuiFormControlLabel-label": {
            fontWeight: 500,
            fontSize: "1.2rem"
        },
    }
    

    /**returns true if the given string is a legal and valid fen string */
    function isStringValidFen(potentialFen : string):boolean{
        try{
            new Chess(potentialFen)
        }
        catch (err){
            return false
        }
        return true
    }

    function onClickCopyFen(){
        const fen = fenInputRef?.current?.value
        if (fen){
            if (isStringValidFen(fen)){
                navigator.clipboard.writeText(fen)
            }
        }    
    }

    function onClickDeleteFen(){
        fenInputRef.current!.value = ''
        setInputUnderlineColor('white')
    }

    function onClickReset(){
        
        let fen = fenInputRef.current?.value
        if (fen == ''){
            fen = INITIAL_FEN
        }
        if (fen && isStringValidFen(fen)){

            let colorCanMove = selectedColor
            if (selectedColor == 'random'){
                colorCanMove = ['white', 'black'][Math.floor(Math.random()*2)] as 'black'|'white'
            }

            reset(colorCanMove as 'white'|'black', fen)
        }
    
    }

    function onClickEdit(){
        setIsEditModeActive(!isEditModeActive)
    }

    function onFenInputChange(event:any){
        const fen = event.target.value
        if (fen == '' || isStringValidFen(fen)){
            setInputUnderlineColor('white')
        }
        else{
            setInputUnderlineColor('red') 
        }
    }

    function onChangeSelectedColor(event:any){
        setSelectedColor(event.target.value)
    }
        
    return (
        <div className={styles.main}>

            <div className={styles.resetAndEdit}>

                <div className={styles.reset} onClick={onClickReset} style={{
                    backgroundColor: isResetButtonHovered ? HOVERED_COLOR : UNHIGHLIGHTED_COLOR
                }} onMouseEnter={()=>setIsResetButtonHovered(true)}
                onMouseLeave={()=>setIsResetButtonHovered(false)}>
                    Reset Position
                    <div className={styles.resetImage} />
                </div>

                <div className={styles.edit} onMouseEnter={()=>setIsEditButtonHovered(true)} 
                onMouseLeave={()=>setIsEditButtonHovered(false)} onClick={onClickEdit} style={{
                    backgroundColor: isEditModeActive 
                        ? HIGHTLIGHTED_COLOR 
                        : isEditButtonHovered 
                            ? HOVERED_COLOR 
                            : UNHIGHLIGHTED_COLOR
                }}>
                    Edit Mode
                </div>

            </div>
            

            <div className={styles.colorSelect}>
                <div>Play As:</div> <br/>

                 <RadioGroup sx={{
                        '& .MuiRadio-root' : {
                            color: 'white'
                        }
                    }}   
                    value={selectedColor}
                    onChange={onChangeSelectedColor}
                >
                    <FormControlLabel sx={formControlLabelSx} value="white" control={<Radio />} label="White" />
                    <FormControlLabel sx={formControlLabelSx} value="random" control={<Radio />} label="Random" />
                    <FormControlLabel sx={formControlLabelSx}  value="black" control={<Radio />} label="Black" />
                </RadioGroup>
                
            </div>
            
            <div className={styles.fen}>
                <div className={styles.input}>
                    <input onChange={onFenInputChange} ref={fenInputRef} placeholder='Paste FEN here'></input>
                    <div className={styles.line} style={{backgroundColor: inputUnderlineColor}}/>
                </div>
                <IconButton onClick={onClickCopyFen} sx={{color: 'white','&:hover': {backgroundColor: '#545454'}}}>
                    <ContentCopyIcon sx={{fill: 'white'}}/>
                </IconButton> 
                <IconButton onClick={onClickDeleteFen} sx={{color: 'white','&:hover': {backgroundColor: '#545454'}}}>
                    <Delete sx={{fill: 'white'}}/>
                </IconButton> 
            </div>
            
        </div>
    )
}
