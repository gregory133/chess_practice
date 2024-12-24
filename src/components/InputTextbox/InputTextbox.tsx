import React, { ChangeEvent, useState } from 'react'
import TextField from '@mui/material/TextField';

interface Props{
    onChange : (value:string)=>void
}

export default function InputTextbox(props:Props) {
    const HOVERED_COLOR = '#a1a1a1'
    const UNHOVERED_COLOR = '#73726f'
    const [color, setColor] = useState(UNHOVERED_COLOR)

    function onChange(event:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
        const newValue = event.target.value
        props.onChange(newValue)
        
    }

    return (
        <TextField onChange={onChange} onMouseLeave={()=>setColor(UNHOVERED_COLOR)} 
        onMouseEnter={()=>setColor(HOVERED_COLOR)} sx={{
            '& .MuiOutlinedInput-notchedOutline':{
                borderColor: `${color} !important`
            },
            '& .MuiInputLabel-root' :{   
                color: 'white'
            },
            '& .MuiOutlinedInput-root':{
                color: 'white'
            }
        }} label='Enter Lichess username' variant='outlined'/>
    )
}
