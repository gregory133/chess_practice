import { Dictionary } from "typescript-collections";
import { Database } from "../../api/DBApi";
import DatabaseSettings from "../../interfaces/DatabaseSettings";
import { TimeControl } from "../../types/TimeControl";

export default class PlayerDatabaseSettings implements DatabaseSettings{

    private username : string
    private maxGames? : number
    private vsPlayer? : string
    private color : 'white'|'black'
    private timeControls? : TimeControl[]

    public constructor(username : string, color : 'white'|'black', maxGames? : number, vsPlayer? : string,
        timeControls? : TimeControl[]
    ){
        this.username = username
        this.maxGames = maxGames
        this.vsPlayer = vsPlayer
        this.color = color
        this.timeControls = timeControls
    }

    public getDatabaseName() : Database{
        return 'player'
    }

    public getURL() : URL{

        const url = new URL(`https://lichess.org/api/games/user/${this.username}`)

        if (this.vsPlayer){
            url.searchParams.set('vs', this.vsPlayer)
        }
        if (this.maxGames){
            url.searchParams.set('max', this.maxGames.toString())
        }
        if (this.timeControls){
            url.searchParams.set('perfType', this.timeControls.toString())
        }
        url.searchParams.set('color', this.color)
        
        return url

    }


}