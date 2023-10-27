import { Move } from "chess.js";

export default interface TrainingModeStrategy{

  afterMove(newFen:string, previousMove:Move, makeEngineMove?:
    (san:string)=>void):void

}