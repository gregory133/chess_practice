import { Move } from "chess.js";
import Winrate from "../classes/Winrate";

export interface InitialValues{
  fen:string,
  colorPlayerCanControl: 'white'|'black',
  orientation: 'white'|'black',
  canPlayerMove:boolean,
  onInit: (param?:any)=>void
}

export default interface TrainingModeStrategy{

  afterPlayerMove(newFen:string, previousMove:Move, makeEngineMove?:
    (san:string)=>void):void

  afterEngineMove(newFen:string, previousMove:Move):void
  setWinrate: (winrate:Winrate|null)=>void
  setNumGamesInDB: (num:number|null)=>void
  setNumMovesInDB: (num:number|null)=>void

  initialValues: InitialValues,

}