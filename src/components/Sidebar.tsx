import React from 'react'
import '../styles/Sidebar.css'
import WinrateBar from './WinrateBar'
import Winrate from '../classes/Winrate'

interface Props{
  openingName:string
}

export default function Sidebar(props:Props) {

  return (
    <div className='sidebar'>
      <p>{props.openingName}</p>
      {/* <div>hello</div> */}
      <WinrateBar winrate={new Winrate(1/3, 1/3)}/>
    </div>
  )
}
