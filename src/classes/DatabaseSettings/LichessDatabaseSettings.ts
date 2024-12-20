import { Dictionary, Set } from "typescript-collections";
import DatabaseSettings from "../../interfaces/DatabaseSettings";
import { TimeControl } from "../../types/TimeControl";
import { Rating } from "../../types/Rating";
import { Database } from "../../api/DBApi";

export default class LichessDatabaseSettings implements DatabaseSettings{

  private fen:string
  private timeControls:TimeControl[]
  private ratings:Rating[]
  
  public constructor(fen:string, timeControls: TimeControl[], ratings: Rating[]){
    this.fen = fen
    this.timeControls = timeControls
    this.ratings = ratings
  }

  public getDatabaseName():Database{
    return 'lichess'
  }


  public getURL() : URL{

    const url = new URL('https://explorer.lichess.ovh/lichess')

    url.searchParams.set('fen', this.fen)
    url.searchParams.set('speeds', this.timeControls.toString())
    url.searchParams.set('ratings', this.ratings.toString())

    return url
  }
  
}