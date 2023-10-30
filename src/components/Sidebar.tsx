import React from 'react'
import '../styles/Sidebar.css'
import WinrateBar from './WinrateBar'
import Winrate from '../classes/Winrate'

interface Props{
  openingName:string
  winrate: Winrate|null
}

export default function Sidebar(props:Props) {

  return (
    <div className='sidebar'>
      <p>{props.openingName}</p>
      {
        props.winrate ? <WinrateBar winrate={props.winrate}/> : null
      }
    </div>
  )
}
