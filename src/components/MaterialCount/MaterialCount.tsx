import React, { useEffect, useState } from 'react'
import { useChessStore } from '../../stores/chessStore'
import { Dictionary } from 'typescript-collections'
import styles from './MaterialCount.module.scss'

export default function MaterialCount() {

  const piecesValueDict:Dictionary<string, number>=new Dictionary();{
    piecesValueDict.setValue('q', 9)
    piecesValueDict.setValue('r', 5)
    piecesValueDict.setValue('b', 3)
    piecesValueDict.setValue('n', 3)
    piecesValueDict.setValue('p', 1)
  }

  const currentFen=useChessStore(state=>state.currentFen)
  const [materialCount, setMaterialCount]=useState<Number>(0) 

  useEffect(()=>{
    const newMaterialCount:number=calculateMaterialCount(currentFen)
    setMaterialCount(newMaterialCount)
  }, [currentFen])

  function calculateMaterialCount(fen:string){

    const positionPart=fen.split(' ')[0]
    let total=0
    
    for (let i=0; i<positionPart.length; i++){
      const letter=positionPart.charAt(i)
      const lowercaseLetter=letter.toLowerCase()
      const colorFactor:number = (letter===lowercaseLetter) ? -1 : 1
      
      if (piecesValueDict.containsKey(lowercaseLetter)){
        total+=piecesValueDict.getValue(lowercaseLetter)!*colorFactor
      }

    }

    return total
  }

  return (
    <div className={styles.container}>
      <p >{""+materialCount}</p>
      <img src={process.env.PUBLIC_URL+'/images/pawn.png'}/>
    </div>
    
    
  )
}
