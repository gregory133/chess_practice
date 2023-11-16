import React, { useEffect, useState } from 'react'
import { Eval } from '../classes/Stockfish'
import styles from "../styles/EvalBar.module.css"

interface Props{
  evaluation: Eval,
  isWhiteAtBottom: boolean
}

export default function EvalBar(props:Props) {

  const rotationTransform=props.isWhiteAtBottom ? 'rotate(180deg)' : 'rotate(0deg)'
  const WHITE='#A0A0A0'
  const BLACK='#666666'
  const [bottomFlex, setBottomFlex]=useState<number>(999)

  /**
   * given an evaluation value, returns the flex proportion number the 
   * component needs in order to balance the proper eval. The flex proportion
   * is calculated based on a Logistic function
   * @param evalValue 
   * @returns 
   */
  function getFlexProportionFromEvalValue(evalValue:number){
    const curveBalanceFactor=0.2
    return Math.exp(-1*curveBalanceFactor*evalValue)
  }

  
  function adjustBarProportion(evaluation:Eval){
    const bigNumber=999
    if (evaluation.type=='mate'){
      evaluation.value < 0 ? setBottomFlex(bigNumber) : setBottomFlex(0)
    }
    else if (evaluation.type=='cp'){
      const evalValue=evaluation.value
      const flexProportion=getFlexProportionFromEvalValue(evalValue)
      setBottomFlex(flexProportion)
    }
  }

  useEffect(()=>{
    console.log(bottomFlex);
  }, [bottomFlex])

  useEffect(()=>{
    adjustBarProportion(props.evaluation)
  }, [props.evaluation])

  return (
    <div className={styles.bar} style={{
      transform: rotationTransform
    }}>
      <div className={styles.topBar} style={{flex: 1}}>
       
      </div>
      <div className={styles.bottomBar} style={{flex: bottomFlex}}>
      
      </div>
      <div className={styles.middleBar}/>
    </div>
  )
}
