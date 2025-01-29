import React, { LegacyRef, useEffect, useRef, useState } from 'react'
import styles from './OpeningsSearchBar.module.scss'
import { Dictionary } from 'typescript-collections'
import stringSimilarity from "string-similarity";
import assert from 'assert';
import { useChessStore } from '../../stores/chessStore';
import { Chess } from 'chess.js';

export default function OpeningsSeachBar() {

  const inputRef = useRef<HTMLInputElement>(null)

  const [openingNamesDict, setOpeningNamesDict] = useState<Dictionary<string,  string>>(new Dictionary())
  const [openingNamesSuggestions, setOpeningNamesSuggestions] = useState<string[]>([])
  const [inputFocused, setInputFocused] = useState<boolean>(false)

  const reset = useChessStore(state=>state.reset)
  const setStartingFen = useChessStore(state=>state.setStartingFen)
     
  
  useEffect(()=>{
    loadOpeningNamesDict()
  }, [])

  function loadOpeningNamesDict(){
    fetch('/openings_sheet.json')
    .then(res=>res.json())
    .then(data=>{

      const openingNamesDictCopy = new Dictionary<string, string>()

      data.forEach((openingObject:any)=>{
        const openingName = Object.keys(openingObject)[0]
        openingNamesDictCopy.setValue(openingName, openingObject[openingName])
      })

      setOpeningNamesDict(openingNamesDictCopy)
      
    })
  }

  function findSimilarKeys(searchString:string, numResults:number) : string[]{
    assert(numResults > 0)

    const SIMILARITY_THRESHOLD = 0.2

    const matches = stringSimilarity.findBestMatch(searchString, openingNamesDict.keys())
    const sortedMatches = matches.ratings
      .sort((a, b) => b.rating - a.rating)
      .slice(0, numResults);

    const relevantMatches = sortedMatches.filter(sortedMatch => sortedMatch.rating >= SIMILARITY_THRESHOLD)

    return relevantMatches.map(relevantMatch => relevantMatch.target)

  }

  function onInputValueChange(event:any){
    setOpeningNamesSuggestions(findSimilarKeys(event.target.value, 5)) 
  }

  function onClickOpeningSuggestion(openingName:string){
    loadOpening(openingName)
  }

  function loadOpening(openingName:string){
    const chess = new Chess()
    const moves = openingNamesDict.getValue(openingName)
    const moveList = moves?.split(' ')

    moveList?.forEach(move=>{
      chess.move(move)
    })

    setStartingFen(chess.fen())
    reset()
    
  }

  return (
    <div className={styles.main}>
      <input onChange={onInputValueChange} ref={inputRef} placeholder='Search for an Opening' autoComplete='off' 
      type='text' onBlur={()=>setTimeout(()=>{setInputFocused(false)}, 100) } 
      onFocus={()=>setInputFocused(true)}></input>
      <div className={styles.suggestionList}>
        {
          !inputFocused ? null :
          openingNamesSuggestions.map((suggestion, index)=>{
            return (
              <div onClick={()=>onClickOpeningSuggestion(suggestion)} key={index}>
                {suggestion}
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
