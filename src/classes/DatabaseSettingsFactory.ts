import { Set } from "typescript-collections";
import { Database } from "../api/DBApi";
import DatabaseSettings from "../interfaces/DatabaseSettings";
import { Rating } from "../types/Rating";
import { TimeControl } from "../types/TimeControl";
import LichessDatabaseSettings from "./DatabaseSettings/LichessDatabaseSettings";
import MastersDatabaseSettings from "./DatabaseSettings/MastersDatabaseSettings";


export default class DatabaseSettingsFactory{

  private since:number
  private until:number
  private timeControls:Set<TimeControl>
  private ratings: Set<Rating>
  public constructor(since:number, until:number, timeControls:Set<TimeControl>, ratings:Set<Rating>){

    this.since=since
    this.until=until
    this.timeControls=timeControls
    this.ratings=ratings

  }

  /**
   * 
   * @param database 
   * @returns an object encapsulating the required DatabaseSettings given the particular Database object
   */
  public constructDatabaseSettingsObject(database:Database):DatabaseSettings|null{

    if (database=='lichess'){
      return new LichessDatabaseSettings(this.timeControls, this.ratings)
    }
    else if (database=='masters'){
      return new MastersDatabaseSettings(this.since, this.until)
    }
    else{
      return null
    }

  }


}