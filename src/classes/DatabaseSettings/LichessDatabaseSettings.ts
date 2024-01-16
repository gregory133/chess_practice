import { Dictionary, Set } from "typescript-collections";
import DatabaseSettings from "../../interfaces/DatabaseSettings";
import { TimeControl } from "../../types/TimeControl";
import { Rating } from "../../types/Rating";
import { Database } from "../../api/DBApi";

export default class LichessDatabaseSettings implements DatabaseSettings{

  private timeControls:Set<TimeControl>
  private ratings:Set<Rating>
  
  public constructor(timeControls: Set<TimeControl>, ratings: Set<Rating>){
    this.timeControls=timeControls
    this.ratings=ratings
  }

  public getDatabaseName():Database{
    return 'lichess'
  }
  
  public getURLParameters(){

    let speeds=''
    let ratings=''

    this.timeControls.forEach((timeControl)=>{
      speeds=speeds+timeControl+','
    })
    speeds=speeds.slice(0, -1)

    this.ratings.forEach((rating)=>{
      ratings=ratings+rating+','
    })
    ratings=ratings.slice(0, -1)

    const dict=new Dictionary<string, string>();{
      dict.setValue('speeds', speeds)
      dict.setValue('ratings', ratings)
    }

    return dict
      
  }
  
}