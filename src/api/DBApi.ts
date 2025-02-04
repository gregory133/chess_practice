import DatabaseJsonParser from "../classes/DatabaseJsonParser"
import Playrate from "../classes/Playrate"
import DatabaseSettings from "../interfaces/DatabaseSettings"
import { Rating } from "../types/Rating"
import { TimeControl } from "../types/TimeControl"

const baseHost='https://explorer.lichess.ovh'

export type Database='masters'|'lichess'|'player'
// export type DatabaseSettings=MastersDatabaseSettings|LichessDatabaseSettings
// export type MastersDatabaseSettings={since:number, until:number}
// export type LichessDatabaseSettings={speeds: TimeControl[], ratings: Rating[] }

/**
 * fetches the url and returns a promise that resolves with the json
 * object returned by that url
 * @param url
 * @returns 
 */
export function fetchDBByUrl(url:URL){

  return new Promise((res, rej)=>{
    fetch(url)
    .then(data=>data.json())
    .then(json=>{
      res(json)
    })
    .catch(err=>{
      rej(err)
    })
  })

}


/**
 * returns a promise resolving into json object corresponding to the response of a 
 * fetch query to the database with the given uci list
 * @param uciList 
 */
export function fetchDB(databaseSettings:DatabaseSettings):Promise<any>{
  return new Promise((res, rej)=>{
    fetchDBByUrl(databaseSettings.getURL())
    .then(json=>{
      res(json)
    })
  })
}

/**
 * @param json a json object representing the response from the lichess API
 * @returns the list of objects containing
 * the SAN notation moves belonging to the given database json and their associated
 * frequency
 */
export function getSanListFromDB(json:any):{san:string, frequency:number}[]{
  // console.log(json)
  let totalFrequency=json.moves.reduce((totalFrequency:number, move:any)=>{
    return totalFrequency+move.white+move.black+move.draws
  }, 0)
  return json.moves.map((move:any)=>{
    return {san: move.san, frequency:(move.white+move.black+move.draws)/totalFrequency} 
  })
}

/**Given the JSON response corresponding to a database fetch, returns the Playrate object
 * corresponding to the response
 * @param color The color that the database is supposed to play
 * @param database The database object
 */
export function getPlayrateFromDB(database:Database, color:'white'|'black', json:any):Playrate{
  const sanList = getSanListFromDB(json)
  const dbResponse = DatabaseJsonParser.getInstance().parseJson(database, color, json)
  const playrateObject = new Playrate()

  sanList.forEach(sanObject=>{
    const san = sanObject.san
    const playrate = Math.round(sanObject.frequency*100) / 100
    const winrate = dbResponse?.movesWinrate.getValue(san)!

    playrateObject.add(san, playrate, winrate)
  })
  
  return playrateObject
}
