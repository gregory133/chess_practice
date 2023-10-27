import { Move } from "chess.js";
import TrainingModeStrategy, { InitialValues } from "../../interfaces/TrainingModeStrategy";
import { fetchMastersDB, getSanListFromMasterDB } from "../../api/mastersDBApi";
import TreeMap from "ts-treemap";

export default class HumanVSMaster implements TrainingModeStrategy{

  private STARTING_FEN= 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  private makeEngineMove:(san:string)=>void

  public initialValues: InitialValues

  public constructor(makeEngineMove:(san:string)=>void){
    this.makeEngineMove=makeEngineMove
    this.initialValues= this.initializeInitialValues()
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
        this.afterMove(this.STARTING_FEN)
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
  public afterMove(newFen:string, previousMove?:Move): void {

    fetchMastersDB(newFen)
    .then(json=>{
      const responsesList=getSanListFromMasterDB(json)
      const chosenResponse = this.pickRandomResponse(responsesList)
      this.makeEngineMove(chosenResponse)
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

}