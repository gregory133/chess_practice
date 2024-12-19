import { Dictionary } from "typescript-collections"
import PlayerDatabase from "../classes/PlayerDatabase"
import DownloadLichessPlayerGamesOptions from "../interfaces/DownloadLichessPlayerGamesOptions"
//@ts-ignore
import ndJsonStream from 'can-ndjson-stream'
import { INITIAL_FEN } from "../classes/ChessUtil"

export default class PlayerGameDownloader{

  private numGamesAdded : number
  private db:PlayerDatabase

  public constructor(){
    this.db = new PlayerDatabase()
    this.numGamesAdded = 0
  }

  private addGameToDatabaseTree(gameObject : any) : Promise<void> {

    const numHalfMovesMax = 20

    const moves = gameObject.moves
    let movesList : string[] = moves.split(' ')
    movesList = movesList.slice(0, numHalfMovesMax)
    const outcome = gameObject.winner

    return new Promise((resolve, reject)=>{

      
      if (moves==''){
        resolve()
        return
      }
      
      this.db.addGameOutcome(movesList, outcome) 
      resolve()

    }) 
    
  }

  /**
   *
   * @param username username of the player
   * @param options object that encapsulates the fetch options
   * Returns a URL object ready to be used to fetch games of the player     */
  private getURL(username:string, options: DownloadLichessPlayerGamesOptions) : URL{

      let fetchURL = new URL(`https://lichess.org/api/games/user/${username}?pgnInJson=true`)

      let timeControlsParams = ''

      const color = options.color
      const maxNumberGames = options.maxNumber
      const timeControls = options.timeControls
      const vsPlayer = options.vsPlayer

      if (vsPlayer){
          fetchURL.searchParams.set('vs', vsPlayer)
      }

      if (timeControls){
          timeControls?.forEach(timeControl => {
              timeControlsParams = timeControlsParams + timeControl + ','
              
          })
          timeControlsParams = timeControlsParams.substring(0, timeControlsParams.length - 1) 
          fetchURL.searchParams.set('perfType', timeControlsParams)
      }

      if (maxNumberGames){
          fetchURL.searchParams.set('max', maxNumberGames.toString())
      }

      fetchURL.searchParams.set('color', color)
      fetchURL.searchParams.set('rated', 'true')

      return fetchURL
  }

  public downloadGames(username:string, options: DownloadLichessPlayerGamesOptions){

    const controller = new AbortController()
    const URL = this.getURL(username, options)

    console.log(URL.toString())
    fetch(URL, {
      method: 'get',
      signal: controller.signal,
      headers: {
        'Accept': 'application/x-ndjson'
      }
    })
    .then(response => ndJsonStream(response.body))
    .then((stream:ReadableStream)=>{
      const reader = stream.getReader()
      let read:any;
      reader.read()
      .then(read = (result:any)=>{
        if (result.done){
          const playerDatabase = this.db.getDatabase()
          console.log(playerDatabase.getValue(INITIAL_FEN))
          
          return
        }
        this.addGameToDatabaseTree(result.value)
        .then(()=>{
          this.numGamesAdded++
          if (this.numGamesAdded == 30){

            reader.cancel()
            reader.releaseLock()
            stream.cancel() 
            controller.abort() 
          }
          console.log(`${this.numGamesAdded} games crunched`)
        })
      
        
        reader.read().then(read)     
      })
    })  

    
    
  }
      
       

}