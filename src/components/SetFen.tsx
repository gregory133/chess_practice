import React from 'react'
import TextField from '@mui/material/TextField';
import styles from '../styles/SetFen.module.css'

export default function SetFen() {
 
  return (
    <div>
    
      <TextField sx={{
        '& fieldset': {
          borderColor: '#696765', // Change this to your desired border color
        },
        
        '&:hover fieldset': {
          borderColor: '#696765' + '!important', // Change this to the hover border color
        },
        '& .MuiOutlinedInput-root':{borderColor: 'white', color: 'white'},
        '& .MuiInputLabel-formControl' : {
          color: 'white'
        }
      }} label='Starting FEN' variant='outlined'/>
    </div>
  )
}
