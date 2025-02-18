import React from 'react'
import Winrate from '../../classes/Winrate'
import styles from './WinrateBar.module.scss'

interface Props{
  winrate:Winrate|null
}

export default function WinrateBar(props:Props) {

  let blackStyle:React.CSSProperties={flex: 1}
  let drawStyle:React.CSSProperties={flex: 1}
  let whiteStyle:React.CSSProperties={flex: 1}

  if (props.winrate){
    blackStyle={flex: props.winrate.black}
    whiteStyle={flex: props.winrate.white}
    drawStyle={flex: props.winrate.draw}
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
    <div className={styles.bar}>
      <div style={blackStyle} className={styles.blackBar}>
        {
          props.winrate 
          ? computeTextPercentage(props.winrate.black)
          : '-'
        }
      </div>
      <div style={drawStyle} className={styles.drawBar}>
      {
          props.winrate 
          ? computeTextPercentage(props.winrate.draw)
          : '-'
        }
      </div>
      <div style={whiteStyle} className={styles.whiteBar}>
      {
          props.winrate 
          ? computeTextPercentage(props.winrate.white)
          : '-'
        }
      </div>
    </div>
  )
}
