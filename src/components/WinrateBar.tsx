import React from 'react'
import Winrate from '../classes/Winrate'
import '../styles/WinrateBar.css'

interface Props{
  winrate:Winrate
}

export default function WinrateBar(props:Props) {

  const blackStyle:React.CSSProperties={
    flex: props.winrate.black
  }
  const drawStyle:React.CSSProperties={
    flex: props.winrate.draw
  }
  const whiteStyle:React.CSSProperties={
    flex: props.winrate.white
  }

  return (
    <div className='container'>
      <div style={blackStyle} className='blackBar'></div>
      <div style={drawStyle} className='drawBar'></div>
      <div style={whiteStyle} className='whiteBar'></div>
    </div>
  )
}
