const baseHost='https://explorer.lichess.ovh'

type Database='masters'|'lichess'

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
 * returns a json object corresponding to the json response of a 
 * fetch query to the lichesss masters database with the given uci list
 * @param uciList 
 */
export function fetchDB(fen:string, dbType:Database):Promise<any>{

  return new Promise((res, rej)=>{
    fetchDBByUrl(getDBUrl('/'+dbType,fen))
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
function getDBUrl(hostPath: string, fen:string):string{
  let url=new URL(baseHost+hostPath);

  url.searchParams.append('fen', fen)
  return url.toString()
}
