import { Dictionary } from "typescript-collections";
import Winrate from "./Winrate";

/**Class which encapsulates the playrate (and their associated winrates) of moves in a position */
export default class Playrate{

    private playrateDict : Dictionary<string, {playrate: number, winrate: Winrate}>

    public constructor(){
        this.playrateDict = new Dictionary()
    }

    public add(move: string, playrate: number, winrate: Winrate){
        if (this.validateParams(playrate)){
            this.playrateDict.setValue(move, {playrate: playrate, winrate:winrate})
        }
    }

    public toString():string{
        
        let entries : string[] = []
        this.playrateDict.keys().forEach(key=>{
            entries.push(key + ' -> ' + this.playrateDict.getValue(key)?.playrate + '% ' +
            this.playrateDict.getValue(key)?.winrate.toString())
        })

        return entries.join('\n')



    }

    private validateParams(playrate: number) : boolean{
        if ((playrate < 0) || (playrate > 1)){
            return false
        }
        return true
    }
}