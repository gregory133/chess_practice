const host:string='https://explorer.lichess.ovh'


/**
 * returns a json object corresponding to the json response of a 
 * fetch query to the lichesss masters database with the given uci list
 * @param uciList 
 */
export function fetchMastersDB(fen:string):Promise<any>{

  return new Promise((res, rej)=>{
    const url=getMastersDBUrl(fen)
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
 * @param json a json object representing the response from the lichess API
 * @returns the list of objects containing
 * the SAN notation moves belonging to the masters databasea and their associated
 * frequency
 */
export function getSanListFromMasterDB(json:any):{san:string, frequency:number}[]{
  let totalFrequency=json.moves.reduce((totalFrequency:number, move:any)=>{
    return totalFrequency+move.white+move.black+move.draws
  }, 0)
  return json.moves.map((move:any)=>{
    return {san: move.san, frequency:(move.white+move.black+move.draws)/totalFrequency} 
  })
}

/**
 * utility function to construct and obtain the url of the lichess
 * masters database
 * @param uciList 
 * @returns 
 */
function getMastersDBUrl(fen:string):string{
  let url=new URL(host+'/masters');

  url.searchParams.append('fen', fen)
  return url.toString()
}
