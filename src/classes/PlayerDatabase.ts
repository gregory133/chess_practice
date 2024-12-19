/**
 * This class represents a tree which encodes a particular view of a player's game database.
 * Each Vertex stores a position and the winrate associated with that position for the player
 */

import { Dictionary } from "typescript-collections"
import { INITIAL_FEN } from "./ChessUtil"
import { Chess } from "chess.js"


export default class PlayerDatabase{

    private outcomeDict : Dictionary<string, {white:number, black:number, draw:number}>

    public constructor(){
        this.outcomeDict = new Dictionary()

    }

    /**
     * Adds the game's individual positions to the overall tally
     * @param movesList sequence of moves in the game
     * @param outcome 
     * @param isPlayingWhite 
     */
    public addGameOutcome(movesList : string[], outcome : 'white'|'black'|'draw'){

        /**This function adds the position;s outcome to the cummulative tally */
        const addPositionOutcomeToTally = (position:string)=>{
            
            if (!this.outcomeDict.containsKey(position)){    
                this.outcomeDict.setValue(position, {white:0, black:0, draw:0})
            }
            const outcomeTally = this.outcomeDict.getValue(position)!
            if (outcome == 'white'){
                outcomeTally.white ++
            }
            else if (outcome == 'black'){
                outcomeTally.black ++
            }
            else{
                outcomeTally.draw ++ 
            }
 
        }
        
        const chess = new Chess()
        movesList.forEach(move=>{
            addPositionOutcomeToTally(chess.fen())
            chess.move(move)
        })
        addPositionOutcomeToTally(chess.fen())

        // console.log(this.toString()) 

    }

    public toString() : string{
        let outputString = ''
        this.outcomeDict.forEach(position=>{
            const tally = this.outcomeDict.getValue(position)
            outputString += `${position}: ${tally?.white}/${tally?.draw}/${tally?.black}` + '\n'
        })
        return outputString
    }


}