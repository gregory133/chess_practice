import React, { ReactNode, useEffect, useState } from 'react'

interface Props{
  squareLength: number
  child:ReactNode
}

export default function ResponsiveSquare(props:Props) {

  useEffect(()=>{

  }, [props.squareLength])
  
  return (
    <div style={{
      width: props.squareLength,
      height: props.squareLength,
    }}>
      {props.child}
    </div>
  )
}
