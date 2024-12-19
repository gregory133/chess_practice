import { Dictionary } from "typescript-collections"
import { Database } from "../api/DBApi"
import DatabaseResponse from "../interfaces/DatabaseResponse"
import Winrate from "./Winrate"

/**
 * Parses the json response from a cloud database into a format that can be read by the
 * program
 */
export default class DatabaseJsonParser{

    public static instance : DatabaseJsonParser|null

    private constructor(){

    }

    public static getInstance():DatabaseJsonParser{
        if (this.instance == null){
            this.instance = new DatabaseJsonParser()
        }
        return this.instance
    }

    /**
     * 
     * @param database 
     * @param color the color that the database is supposed to play ('white' or 'black')
     * @param json 
     * @returns 
     */
    public parseJson(database:Database, color: 'white'|'black', json:any):DatabaseResponse|null{

        if (database == 'masters' || database == 'lichess'){

            const sum:number = json.white + json.black + json.draws
            const currentColor:number = color == 'white' ? json.white : json.black

            let movesWinrate: Dictionary<string, Winrate> = new Dictionary()
            json.moves.forEach((move:any)=>{
                const moveSum = move.white + move.black + move.draws
                movesWinrate.setValue(move.uci, new Winrate(move.white/moveSum, move.black/moveSum))
            })

            return {
                database : database,
                winrate : new Winrate(json.white/sum, json.black/sum),
                numGamesInDB: sum,
                movesWinrate: movesWinrate 
                
            } as DatabaseResponse
        }
 
        return null
    }

}