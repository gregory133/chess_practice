import TreeMap from "ts-treemap"
import { Database, fetchDB, getSanListFromDB } from "../api/DBApi"
import { useChessStore } from "../stores/chessStore"


export default class Engine{

  
  private fen:string

  public constructor(fen:string){
    this.fen=fen
  }

  /**
   * setter for FEN
   * @param fen 
   */
  public setFen(fen:string){
    this.fen=fen
  }

  /**
   * @param json json object representing response from lichess API
   * @returns a random move chosen from the list of possible responses stored
   * in the given json response
   */
  public getRandomResponseFromDB(json:any):string{
   
    const possibleMovesList=getSanListFromDB(json)
    const chosenResponse=this.pickRandomResponse(possibleMovesList)
    return chosenResponse
    
  }

  /**
   * 
   * @param responsesList 
   * @returns a random response from the given list based on weighed frequency
   */
  private pickRandomResponse(responsesList:{san:string, frequency:number}[]):string {
    const cummulativeFrequenciesMap=new TreeMap<number, string>()
    responsesList.reduce((cummulativeFreqency:number, response:{san:string, 
      frequency:number})=>{
      const newCummulativeFrequency=cummulativeFreqency+response.frequency
      cummulativeFrequenciesMap.set(newCummulativeFrequency, response.san)
      return newCummulativeFrequency
    }, 0)

    const randomNumber=Math.random()
    const chosenResponse=cummulativeFrequenciesMap.ceilingEntry(randomNumber)?.[1]!

    return chosenResponse;
  }

  

  
}