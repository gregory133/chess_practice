import React from 'react'
import '../styles/Sidebar.css'

interface Props{
  openingName:string
}

export default function Sidebar(props:Props) {

  return (
    <div className='sidebar'>
      <p>{props.openingName}</p>
    </div>
  )
}
