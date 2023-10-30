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

  /**
   * returns the pretty-printed text representing the percentage visible in the 
   * bar for the given section
   * @param winrate winrate at a decimal 0 <= x <= 1
   */
  function computeTextPercentage(winrate:number){
    return ""+(winrate*100).toFixed(0).toString()+'%'
  }

  return (
    <div className='bar'>
      <div style={blackStyle} className='blackBar'>
        {computeTextPercentage(props.winrate.black)}
      </div>
      <div style={drawStyle} className='drawBar'>
        {computeTextPercentage(props.winrate.draw)}
      </div>
      <div style={whiteStyle} className='whiteBar'>
        {computeTextPercentage(props.winrate.white)}
      </div>
    </div>
  )
}
