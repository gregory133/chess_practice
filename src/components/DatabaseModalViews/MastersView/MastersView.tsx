import React, { useRef } from 'react'
import styles from './MastersView.module.scss'
import { Dictionary } from 'typescript-collections'
import { YEAR_LOWER_BOUND, YEAR_UPPER_BOUND } from '../../../constants/MastersDatabase'
import { useDatabaseSettingsStore } from '../../../stores/databaseSettingsStore'

type Context='since'|'until'

export default function () {

  const mastersOptions = useDatabaseSettingsStore(state=>state.mastersOptions)
  const setMastersOptions = useDatabaseSettingsStore(state=>state.setMastersOptions)

  const sinceInputRef=useRef<null|HTMLInputElement>(null)
  const untilInputRef=useRef<null|HTMLInputElement>(null)

  const referencesDict:Dictionary<Context, React.MutableRefObject<HTMLInputElement | null>>=new Dictionary();{
    referencesDict.setValue('since', sinceInputRef)
    referencesDict.setValue('until', untilInputRef)
  }

  const yearBoundDict:Dictionary<Context, number>=new Dictionary();{
    yearBoundDict.setValue('since', mastersOptions.since)
    yearBoundDict.setValue('until', mastersOptions.until)
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

  function setInputRefValueToDefault(context:Context){
    const inputRef=referencesDict.getValue(context)!
    if (inputRef){
      if (context=='since'){
        inputRef.current!.value = YEAR_LOWER_BOUND.toString()
      }
      else if (context=='until'){
        inputRef.current!.value = YEAR_UPPER_BOUND.toString()
      }
      
    }
  }

  /**
   * called when the given inputRef storing years is changed
   * @param context 
   */
  function onChangeYearValueInput(context:Context){
    
    let value:number|null=extractValueFromInputRef(context!)
    const isValidChange=(value && areYearsLogicallyValid())

    if (!isValidChange){
      setInputRefValueToDefault(context)
    }

    if (context == 'since'){
      if (!value){
        value = YEAR_LOWER_BOUND
      }
      setMastersOptions({since: value!, until: mastersOptions.until})
    }
    else if (context == 'until'){
      if (!value){
        value = YEAR_UPPER_BOUND
      }
      setMastersOptions({since: mastersOptions.since, until: value!})
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
