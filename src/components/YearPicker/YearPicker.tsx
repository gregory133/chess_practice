import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from 'react';
import dayjs from 'dayjs';

interface Props{

    label:string
    currentYear : number
    maxYear:number
    minYear:number
    defaultYear : number
    yearOrder : 'asc'|'desc'
    onChange : (year:number)=>void
}

export default function YearPicker(props:Props) {

    const HOVERED_COLOR = '#a1a1a1'
    const UNHOVERED_COLOR = '#73726f'
    const [color, setColor] = useState(UNHOVERED_COLOR)

    function onChange(date:dayjs.Dayjs | null){

        if (date){
            props.onChange(date.year())
        }
        
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{margin: '10px'}} onMouseEnter={()=>{setColor(HOVERED_COLOR)}} 
            onMouseLeave={()=>{setColor(UNHOVERED_COLOR)}}>
                <DatePicker 
                value={dayjs(Date.parse(`02 Aug ${props.currentYear} 00:12:00 GMT`))}
                yearsOrder={props.yearOrder} minDate={dayjs(Date.parse(`02 Aug ${props.minYear} 00:12:00 GMT`))} 
                maxDate={dayjs(Date.parse(`02 Aug ${props.maxYear} 00:12:00 GMT`))} label={`${props.label}`} 
                onChange={onChange}
                sx={{
                '& .MuiFormLabel-root' :{
                    color: 'white'
                },
                '& .MuiOutlinedInput-root':{
                    color: 'white'
                },
                '& .MuiOutlinedInput-notchedOutline' :{
                    borderColor: `${color} !important`
                
                },
                '& .MuiButtonBase-root' : {
                    color: 'white'
                }

                }} views={['year']} format='YYYY'/>
            </div>
        </LocalizationProvider>
    )
}
