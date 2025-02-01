import { Dictionary } from "typescript-collections"
import DownloadLichessPlayerGamesOptions from "../interfaces/DownloadLichessPlayerGamesOptions"
//@ts-ignore
import ndJsonStream from 'can-ndjson-stream'
import { INITIAL_FEN } from "../classes/ChessUtil"
import Winrate from "../classes/Winrate"
import Playrate from "../classes/Playrate"

export default class PlayerGameDownloader{


  /**
   *
   * @param username username of the player
   * @param options object that encapsulates the fetch options
   * Returns a URL object ready to be used to fetch games of the player     */
  private getURL(options: DownloadLichessPlayerGamesOptions) : URL{

      let fetchURL = new URL(`https://explorer.lichess.ovh/player`)

      let timeControlsParams = ''

      const username = options.username
      const fen = options.fen
      const color = options.color

      fetchURL.searchParams.set('player', username)
      fetchURL.searchParams.set('color', color)
      fetchURL.searchParams.set('fen', fen)

      return fetchURL
  }

  public downloadGames(options: DownloadLichessPlayerGamesOptions) : Promise<{winrate: Winrate, playrate:Playrate}>{

    return new Promise((resolve, reject)=>{
      const URL = this.getURL(options)

      fetch(URL)
      .then(response=>response.json())
      .then(data=>{
  
        const white = data.white
        const black = data.black
        const draws = data.draws
        const totalGames:number = white + black + draws

        const winrate = new Winrate(black/totalGames, white/totalGames)
        const playrate = new Playrate()
  
        data.moves.forEach((move:any)=>{
  
          const moveSan = move.san
          const move_white = move.white
          const move_black = move.black
          const move_draws = move.draws
          const move_totalGames:number = move_white + move_black + move_draws
          const playrateFraction = move_totalGames / totalGames

          
  
          playrate.add(moveSan, playrateFraction
            , new Winrate(move_black / move_totalGames, move_white / move_totalGames))
        })
        resolve({winrate: winrate, playrate: playrate})
        
      })
  
    })

    
  }
}