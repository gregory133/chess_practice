import { Dictionary } from "typescript-collections";
import { Database } from "../../api/DBApi";
import DatabaseSettings from "../../interfaces/DatabaseSettings";
import { TimeControl } from "../../types/TimeControl";

export default class PlayerDatabaseSettings implements DatabaseSettings{

    private player : string
    private color : 'white'|'black'
    private fen : string

    public constructor(player : string, color : 'white'|'black', fen:string){
        this.player = player
        this.fen = fen
        this.color = color
    }

    public getDatabaseName() : Database{
        return 'player'
    }

    public getURL() : URL{

        const url = new URL(`https://explorer.lichess.ovh/player`)

        url.searchParams.set('color', this.color)
        url.searchParams.set('player', this.player)
        url.searchParams.set('fen', this.fen)
        
        return url

    }


}