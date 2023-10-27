import { Move } from "chess.js";
import TrainingModeStrategy from "../../interfaces/TrainingModeStrategy";
import { fetchMastersDB, getSanListFromMasterDB } from "../../api/mastersDBApi";
import TreeMap from "ts-treemap";

export default class HumanVSMaster implements TrainingModeStrategy{

  public afterMove(newFen:string, previousMove:Move, 
    makeEngineMove:(san:string)=>void): void {

    fetchMastersDB(newFen)
    .then(json=>{
      const responsesList=getSanListFromMasterDB(json)
      const chosenResponse = this.pickRandomResponse(responsesList)
      makeEngineMove(chosenResponse)
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