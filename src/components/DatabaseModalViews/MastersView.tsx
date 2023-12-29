import React from 'react'

export default function () {
  return (
    <div className={style.mastersView}>
      <div><p>Since: </p><input onBlur={()=>onChangeYearValueInput('since')} placeholder={`${lowerBoundYear}`}/></div>
      <div><p>Until: </p><input onBlur={()=>onChangeYearValueInput('until')} placeholder={`${upperBoundYear}`}/></div>
    </div>
  )
}
