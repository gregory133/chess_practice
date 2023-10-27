import { Move } from "chess.js";

export interface InitialValues{
  fen:string,
  colorPlayerCanControl: 'white'|'black',
  orientation: 'white'|'black',
  canPlayerMove:boolean,
  onInit: (param?:any)=>void
}

export default interface TrainingModeStrategy{

  afterMove(newFen:string, previousMove:Move, makeEngineMove?:
    (san:string)=>void):void

  afterEngineMove(newFen:string, previousMove:Move):void

  initialValues: InitialValues,

}