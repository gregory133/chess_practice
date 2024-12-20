import { Dictionary, Set } from "typescript-collections";
import DatabaseSettings from "../../interfaces/DatabaseSettings";
import { TimeControl } from "../../types/TimeControl";
import { Rating } from "../../types/Rating";
import { Database } from "../../api/DBApi";

export default class LichessDatabaseSettings implements DatabaseSettings{

  private timeControls:TimeControl[]
  private ratings:Rating[]
  
  public constructor(timeControls: TimeControl[], ratings: Rating[]){
    this.timeControls=timeControls
    this.ratings=ratings
  }

  public getDatabaseName():Database{
    return 'lichess'
  }
  
  public getURL() : URL{

    const url = new URL('https://explorer.lichess.ovh/lichess')
    url.searchParams.set('speeds', this.timeControls.toString())
    url.searchParams.set('ratings', this.ratings.toString())

    return url
  }
  
}