import React, { useRef } from 'react'
import styles from './MastersView.module.scss'
import { Dictionary } from 'typescript-collections'
import { YEAR_LOWER_BOUND, YEAR_UPPER_BOUND } from '../../../constants/MastersDatabase'

type Context='since'|'until'

export default function () {

  const sinceInputRef=useRef<null|HTMLInputElement>(null)
  const untilInputRef=useRef<null|HTMLInputElement>(null)

  const referencesDict:Dictionary<Context, React.MutableRefObject<HTMLInputElement | null>>=new Dictionary();{
    referencesDict.setValue('since', sinceInputRef)
    referencesDict.setValue('until', untilInputRef)
  }

  const yearBoundDict:Dictionary<Context, number>=new Dictionary();{
    yearBoundDict.setValue('since', YEAR_LOWER_BOUND)
    yearBoundDict.setValue('until', YEAR_UPPER_BOUND)
  }

  /**
   * 
   * @param num 
   * @returns true if the given number is an integer
   */
  function isInteger(num: number): boolean {
    return num === Math.trunc(num);
  }

  /**
   * 
   * @returns true if the years are valid and make logical sense (eg: since <= until)
   */
  function areYearsLogicallyValid():boolean{
    const since=extractValueFromInputRef('since')
    const until=extractValueFromInputRef('until')

    if (since && until){
      return (since<=until)
    }
    return false
  }

  /**
   * 
   * @param num 
   * @returns true if the given number is a valid year. Doesnt check if the year is sensible compared with
   * the other year tho
   */
  function isValidYear(num:number){
    return isInteger(num) && (num>=yearBoundDict.getValue('since')!) && (num<=yearBoundDict.getValue('until')!) 
  }

  /**
   * 
   * @param context 
   * @returns the value stored at the given inputRef or null if such value is invalid
   */
  function extractValueFromInputRef(context:Context):number|null{
    let value:string=''
    const inputRef=referencesDict.getValue(context)!
    if (inputRef.current){
      value=inputRef.current.value
      if (!value){
        value=yearBoundDict.getValue(context)?.toString()!
      }   
    }

    let numValue
    numValue=Number(value)

    if (isValidYear(numValue)){
      return numValue;
    }
    return null 
  }

  /**
   * called when the given inputRef storing years is changed
   * @param context 
   */
  function onChangeYearValueInput(context:Context){
    const value:number|null=extractValueFromInputRef(context!)
    if (value && areYearsLogicallyValid()){

    }

  }

  return (
    <div className={styles.mastersView}>
      <div>
        <p>Since: </p>
        <input ref={sinceInputRef} onBlur={()=>onChangeYearValueInput('since')} 
        placeholder={`${yearBoundDict.getValue('since')}`}/>
      </div>
      <div>
        <p>Until: </p>
        <input ref={untilInputRef} onBlur={()=>onChangeYearValueInput('until')} 
        placeholder={`${yearBoundDict.getValue('until')}`}/></div>
    </div>
  )
}
