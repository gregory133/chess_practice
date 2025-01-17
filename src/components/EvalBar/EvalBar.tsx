import React, { useEffect, useState } from 'react'
import styles from "./EvalBar.module.scss"
import { useChessStore } from '../../stores/chessStore'
import { Evaluation } from '../Stockfish/StockfishComponent'
import { BarLoader, CircleLoader, ClipLoader, ClockLoader, RotateLoader } from 'react-spinners'

export default function EvalBar() {

  const currentFen=useChessStore(state=>state.currentFen)
  const evaluation=useChessStore(state=>state.evaluation)
  const isStockfishArrowActive=useChessStore(state=>state.isStockfishArrowActive)
  const setIsStockfishArrowActive=useChessStore(state=>state.setIsStockfishArrowActive)
  const colorPlayerCanControl=useChessStore(state=>state.colorPlayerCanControl)

  const isWhiteAtBottom=colorPlayerCanControl=='white'
  const rotationTransform=isWhiteAtBottom ? 'rotate(180deg)' : 'rotate(0deg)'
  const WHITE='#A0A0A0'
  const BLACK='#666666'
  const MAX_BOTTOM_FLEX=999

  const [loadingEval, setLoadingEval]=useState<boolean>(false)
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
  function adjustBarProportion(evaluation:Evaluation|null){

    if (evaluation){
      const bigNumber=999
      if (evaluation.eval.type=='mate'){
        evaluation.eval.value < 0 ? setBottomFlex(bigNumber) : setBottomFlex(0)
      }
      else if (evaluation.eval.type=='cp'){
        const evalValue=evaluation.eval.value
        const flexProportion=getFlexProportionFromEvalValue(evalValue)
        setBottomFlex(flexProportion)
      }
    }
    else{
      
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
  function formatEvaluationValue(evaluation: Evaluation|null):string{

    if (evaluation){
      const evalValue=evaluation.eval.value
      const evalType=evaluation.eval.type
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
    else{
      return ''
    }
    

   
    
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

  function onClickToggleArrowButton(){
    setIsStockfishArrowActive(!isStockfishArrowActive)
  }

  function getToggleArrowImageStyles():React.CSSProperties{

    const bgImage=isStockfishArrowActive 
      ? `url('${process.env.PUBLIC_URL}/images/diagonal-arrow-active.png')`
      : `url('${process.env.PUBLIC_URL}/images/diagonal-arrow-inactive.png')`

    return {
      backgroundImage: bgImage
    }
  }

  useEffect(()=>{
    setLoadingEval(false)
    adjustBarProportion(evaluation)
  }, [evaluation])

  useEffect(()=>{
    setLoadingEval(true)
  }, [currentFen])

  return (
    <div className={styles.container}>
      <div className={styles.arrowToggleButton} title='Toggle bestmove engine arrow' 
      onClick={onClickToggleArrowButton}>
        <div style={getToggleArrowImageStyles()}/>
      </div>
      <p className={styles.spinnerContainer}>
        {
          loadingEval 
            ? <ClipLoader color='white'/>
            : <>{formatEvaluationValue(evaluation)}</>
        }    
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
