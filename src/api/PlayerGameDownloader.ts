import PlayerDatabase from "../classes/PlayerDatabase"
import DownloadLichessPlayerGamesOptions from "../interfaces/DownloadLichessPlayerGamesOptions"
//@ts-ignore
import ndJsonStream from 'can-ndjson-stream'

export default class PlayerGameDownloader{

    private db:PlayerDatabase

    public constructor(){
      this.db = new PlayerDatabase()
    }

    private addGameToDatabaseTree(gameObject : any):void{

      const numHalfMovesMax = 20

      const moves = gameObject.moves
      let movesList : string[] = moves.split(' ')
      movesList = movesList.slice(0, numHalfMovesMax)
      const outcome = gameObject.winner

      this.db.addGameOutcome(movesList, outcome) 
      
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

      const URL = this.getURL(username, options)
      console.log(URL.toString())
      fetch(URL, {
          headers: {
            'Accept': 'application/x-ndjson'
          }
        })
        .then(response=> ndJsonStream(response.body))
        .then((stream:ReadableStream)=>{
          const reader = stream.getReader()
          let read:any;
          reader.read()
          .then(read = (result:any)=>{
            if (result.done){
              // console.log(promises)
              console.log(this.db.toString())
              return
            }
            this.addGameToDatabaseTree(result.value)
            // console.log(result.value)
            reader.read().then(read)
            
          })
          
        })  
          
    }
    
    

}