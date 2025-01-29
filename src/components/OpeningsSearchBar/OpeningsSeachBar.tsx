import React, { useEffect, useRef, useState } from 'react'
import styles from './OpeningsSearchBar.module.scss'
import { Dictionary } from 'typescript-collections'
import stringSimilarity from "string-similarity";
import assert from 'assert';

export default function OpeningsSeachBar() {

  const [openingNamesDict, setOpeningNamesDict] = useState<Dictionary<string,  string>>(new Dictionary())
  
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

  function findSimilarKeys(searchString:string, numResults:number){
    assert(numResults > 0)

    const matches = stringSimilarity.findBestMatch(searchString, openingNamesDict.keys())
    const sortedMatches = matches.ratings
      .sort((a, b) => b.rating - a.rating)
      .slice(0, numResults);

    console.log(sortedMatches)

  }

  useEffect(()=>{
    if (!openingNamesDict.isEmpty()){
      findSimilarKeys('Italian', 5)
    }
    
  }, [openingNamesDict])


  
  

  return (
    // <div className={styles.main}>
    //   <input placeholder='Search for an Opening' autoComplete='off' type='text'></input>
    //   <div className={styles.suggestionList}>
    //     {
    //       suggestions.map((suggestion, index)=>{
    //         return (
    //           <div key={index}>
    //             {suggestion}
    //           </div>
    //         )
    //       })
    //     }
    //   </div>
    // </div>
    null
  )
}
