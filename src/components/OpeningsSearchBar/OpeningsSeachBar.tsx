import React, { LegacyRef, useEffect, useRef, useState } from 'react'
import styles from './OpeningsSearchBar.module.scss'
import { Dictionary } from 'typescript-collections'
import stringSimilarity from "string-similarity";
import assert from 'assert';

export default function OpeningsSeachBar() {

  const inputRef = useRef<HTMLInputElement>(null)

  const [openingNamesDict, setOpeningNamesDict] = useState<Dictionary<string,  string>>(new Dictionary())
  const [openingNamesSuggestions, setOpeningNamesSuggestions] = useState<string[]>([])
  const [inputFocused, setInputFocused] = useState<boolean>(false)
  
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

  return (
    <div className={styles.main}>
      <input onChange={onInputValueChange} ref={inputRef} placeholder='Search for an Opening' autoComplete='off' 
      type='text' onBlur={()=>setInputFocused(false)} onFocus={()=>setInputFocused(true)}></input>
      <div className={styles.suggestionList}>
        {
          !inputFocused ? null :
          openingNamesSuggestions.map((suggestion, index)=>{
            return (
              <div key={index}>
                {suggestion}
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
