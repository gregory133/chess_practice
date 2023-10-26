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

export function getSanListFromMasterDB(json:any):string[]{
  return json.moves.map((item:any)=>item.san);
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
