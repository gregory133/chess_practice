import { Move } from "chess.js";
import TrainingModeStrategy, { InitialValues } from "../../interfaces/TrainingModeStrategy";
import TreeMap from "ts-treemap";
import Winrate from "../Winrate";
import { fetchDB, getSanListFromDB } from "../../api/DBApi";

export default class HumanVSMaster implements TrainingModeStrategy{

  private STARTING_FEN= 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  private makeEngineMove:(san:string)=>void
  private setOpeningName: (name:string)=>void
  
  public setWinrate: (winrate:Winrate|null)=>void
  public setNumGamesInDB: (num:number|null)=>void
  public setNumMovesInDB: (num:number|null)=>void

  public initialValues: InitialValues

  public constructor(makeEngineMove:(san:string)=>void, 
  setOpeningName:(newName:string)=>void, setWinrate: (winrate:Winrate|null)=>void,
  setNumGamesInDB: (num:number|null)=>void, 
  setNumMovesInDB: (num:number|null)=>void){
    this.makeEngineMove=makeEngineMove
    this.initialValues= this.initializeInitialValues()
    this.setWinrate=setWinrate
    this.setOpeningName=setOpeningName
    this.setNumMovesInDB=setNumMovesInDB
    this.setNumGamesInDB=setNumGamesInDB
  }
 
  /**
   * contains the business logic to initialize the instance variable initialValues
   */
  private initializeInitialValues(){
    const fen:string=this.STARTING_FEN
    const canPlayerMove=(Math.random()<0.5)
    const colorPlayerCanControl:'white'|'black'=canPlayerMove ? 'white' : 'black'
    const orientation=colorPlayerCanControl
    const onInit=()=>{
      if (!canPlayerMove){
        this.afterPlayerMove(this.STARTING_FEN)
      }
    }
    return {fen:fen, canPlayerMove: canPlayerMove, 
    colorPlayerCanControl: colorPlayerCanControl, orientation:orientation,
    onInit: onInit}
  }

  /**
   * code that should be run after a move has been made by the human player
   * @param newFen 
   * @param previousMove 
   */
  public afterPlayerMove(newFen:string, previousMove?:Move): void {

    fetchDB(newFen, 'masters')
    .then(json=>{
      const responsesList=getSanListFromDB(json)
      const chosenResponse = this.pickRandomResponse(responsesList)
      this.makeEngineMove(chosenResponse)

      this.updateStateAfterAnyMove(json)
    })
    
  }

  /**
   * called after a move has been made automatically by the engine. takes
   * info about the move that was made
   * @param newFen 
   * @param previousMove 
   */
  public afterEngineMove(newFen: string, previousMove: Move): void {
    
    fetchDB(newFen, 'masters')
    .then(json=>{

      this.updateStateAfterAnyMove(json)
    })

  }

  /**
   * 
   * @param responsesList 
   * @returns a random response from the given list
   */
  private pickRandomResponse(responsesList:{san:string, frequency:number}[]):string {
    const cummulativeFrequenciesMap=new TreeMap<number, string>()
    responsesList.reduce((cummulativeFreqency:number, response:{san:string, frequency:number})=>{
      const newCummulativeFrequency=cummulativeFreqency+response.frequency
      cummulativeFrequenciesMap.set(newCummulativeFrequency, response.san)
      return newCummulativeFrequency
    }, 0)

    const randomNumber=Math.random()
    const chosenResponse=cummulativeFrequenciesMap.ceilingEntry(randomNumber)?.[1]!

    return chosenResponse;
  }

  /**
   * 
   * @param json 
   * @returns the opening name described by the json object
   */
  private extractOpeningName(json:any){
    try{
      return json.opening.name as string|null
    }
    catch (err){return null}
    
  }

  /**
   * extracts and returns the winrate object associated with the given json
   * response
   * @param json 
   */
  private extractWinrate(json:any):Winrate{
    const white=json.white
    const black=json.black
    const draws=json.draws
    const sum=white+black+draws
    return new Winrate(black/sum, white/sum)
  }

  private extractNumMovesInDB(json:any):number{
    return json.moves.length
  }

  private extractNumGamesInDB(json:any):number{
    return json.white+json.black+json.draws
  }

  /**
   * contains code that is run to update state variables, after whoever made
   * a move (player or engine)
   */
  private updateStateAfterAnyMove(json:any){
    const winrate=this.extractWinrate(json)
    const numMovesInDB=this.extractNumMovesInDB(json)
    const numGamesInDB=this.extractNumGamesInDB(json)
    const openingName=this.extractOpeningName(json)
    
    this.setNumGamesInDB(numGamesInDB)
    this.setNumMovesInDB(numMovesInDB)
    if (openingName){
      this.setOpeningName(openingName)
    }
    this.setWinrate(winrate)
  }

}