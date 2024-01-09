import TreeMap from "ts-treemap"
import { Database, fetchDB, getSanListFromDB } from "../api/DBApi"
import Stockfish from "./Stockfish"
import { useChessStore } from "../stores/chessStore"
import * as cg from 'chessground/types.js';

export default class Engine{

  private setStockfishSuggestion=useChessStore(state=>state.setStockfishSuggestion)
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
    if (possibleMovesList.length==0){
      this.displayStockfishSuggestion()
    }
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

  private uciMoveToSquares(bestMove:string):{to:cg.Key, from:cg.Key}{
    const from=bestMove.slice(0, 2) as cg.Key
    const to=bestMove.slice(2, 4) as cg.Key
    return {from:from, to:to}
  }

  /**
   * when called, the engine will ask stockfish for the best move and change the value of "stockfishSuggestion"
   * in the state to display Stockfish's best move to the user
   */
  private displayStockfishSuggestion(){
    Stockfish.getInstance().getEval(this.fen)
    .then((evaluation)=>{
      const bestMove=evaluation.bestMove
      const {from, to}=this.uciMoveToSquares(bestMove);
      this.setStockfishSuggestion({from: from ,to: to})
    })
  }

}