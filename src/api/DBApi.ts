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
export function fetchDBByUrl(url:string){

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
 * fetch query to the lichesss masters database with the given uci list
 * @param uciList 
 */
export function fetchDB(fen:string, databaseSettings:DatabaseSettings):Promise<any>{

  return new Promise((res, rej)=>{
    fetchDBByUrl(constructDBUrl(fen, databaseSettings))
    .then(json=>res(json))
  })
}

/**
 * @param json a json object representing the response from the lichess API
 * @returns the list of objects containing
 * the SAN notation moves belonging to the given database json and their associated
 * frequency
 */
export function getSanListFromDB(json:any):{san:string, frequency:number}[]{
  let totalFrequency=json.moves.reduce((totalFrequency:number, move:any)=>{
    return totalFrequency+move.white+move.black+move.draws
  }, 0)
  return json.moves.map((move:any)=>{
    return {san: move.san, frequency:(move.white+move.black+move.draws)/totalFrequency} 
  })
}

/**
 * utility function to construct and obtain the url of a lichess database
 * @param uciList 
 * @returns 
 */
function constructDBUrl(fen:string, databaseSettings:DatabaseSettings):string{
  let url=new URL(`${baseHost}/${databaseSettings.getDatabaseName()}`);
  
  databaseSettings.getURLParameters().forEach((key, value)=>{
    url.searchParams.append(key, value)
  })
  url.searchParams.append('fen', fen)
  return url.toString()
}
