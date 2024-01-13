import React, { useEffect, useState } from 'react'
import Stockfish, { Eval } from '../../classes/Stockfish'
import styles from "./EvalBar.module.scss"
import { useChessStore } from '../../stores/chessStore'

export default function EvalBar() {

  const currentFen=useChessStore(state=>state.currentFen)
  const evaluation=useChessStore(state=>state.evaluation)
  const setEvaluation=useChessStore(state=>state.setEvaluation)
  const colorPlayerCanControl=useChessStore(state=>state.colorPlayerCanControl)

  const isWhiteAtBottom=colorPlayerCanControl=='white'
  const rotationTransform=isWhiteAtBottom ? 'rotate(180deg)' : 'rotate(0deg)'
  const WHITE='#A0A0A0'
  const BLACK='#666666'
  const MAX_BOTTOM_FLEX=999
  const [bottomFlex, setBottomFlex]=useState<number>(MAX_BOTTOM_FLEX)

  const keyEvalBarMarks:number[]=[-900, -500, -300, -100, 0, 100, 300, 500, 900]

  /**
   * given an evaluation value, returns the flex proportion number the 
   * component needs in order to balance the proper eval. The flex proportion
   * is calculated based on a Logistic function
   * @param evalValue 
   * @returns 
   */
  function getFlexProportionFromEvalValue(evalValue:number){
    const curveBalanceFactor=0.2
    return Math.exp(-1*curveBalanceFactor*evalValue*0.01)
  }

  /**
   * adjusts the bar to reflect the given evaluation
   * @param evaluation 
   */
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

  function getTopFromEvalBarMarkValue(markValue:number):string{
    const flexProportion=getFlexProportionFromEvalValue(markValue)
    const percentage=(flexProportion/(flexProportion+1))*100
    // console.log(markValue);
    return `${percentage}%`
  }

  /**
   * pretty prints the eval value for display
   * @param evalValue 
   */
  function formatEvaluationValue(evaluation: Eval):string{

    // console.log(evaluation)
    const evalValue=evaluation.value
    const evalType=evaluation.type
    let formattedString:string=''

    if (evalType=='cp'){
      formattedString=(evalValue/100).toString()
      if (evalValue>0){
        formattedString='+'+formattedString
      } 
    }
    else if (evalType=='mate'){
      formattedString='#'+evalValue
    }

    return formattedString
    
  }

  /**
   * 
   * @returns the styles for the topBar div
   */
  function getTopBarStyles():React.CSSProperties{
    
    const bottomRadius=bottomFlex==0 ? styles.borderRadius : "0px"
    return {
      flex: 1,
      borderBottomLeftRadius: bottomRadius,
      borderBottomRightRadius: bottomRadius
    }
  }

  /**
   * 
   * @returns the styles for the bottomBar div
   */
  function getBottomBarStyles():React.CSSProperties{
    const bottomRadius=bottomFlex==MAX_BOTTOM_FLEX ? styles.borderRadius : "0px"
    return {
      flex: bottomFlex,
      borderTopLeftRadius: bottomRadius,
      borderTopRightRadius: bottomRadius
    }
  }

  useEffect(()=>{
    Stockfish.getEval(currentFen)
    .then((evaluation:{eval:Eval, bestMove:string})=>{
      const evalValue=evaluation.eval
      setEvaluation(evalValue)
    })
  }, [currentFen])

  useEffect(()=>{
    adjustBarProportion(evaluation)
  }, [evaluation])

  return (
    <div className={styles.container}>
      <p>
        {formatEvaluationValue(evaluation)}
      </p>
      <div className={styles.bar} style={{
        transform: rotationTransform
      }}>
        <div className={styles.topBar} style={getTopBarStyles()}/>
        <div className={styles.bottomBar} style={getBottomBarStyles()}/>
        {
          keyEvalBarMarks.map((markValue:number, index:number)=>{
            const top:string=getTopFromEvalBarMarkValue(markValue)
            return markValue==0 
            ? (
              <div key={index} className={styles.middleBar} style={{height: 3, top: top}}/>
            )
            : (
              <div key={index} className={styles.middleBar} style={{top: top}}/>
            )
          })
        }
      </div>
    </div>
    
  )
}
