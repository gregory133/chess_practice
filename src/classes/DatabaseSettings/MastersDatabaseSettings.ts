import { Dictionary } from "typescript-collections";
import DatabaseSettings from "../../interfaces/DatabaseSettings";
import { Database } from "../../api/DBApi";

export default class MastersDatabaseSettings implements DatabaseSettings{

  private since:number
  private until:number

  public constructor(since:number, until:number){
    this.since=since
    this.until=until
  }

  public getDatabaseName():Database{
    return 'masters'
  }
  
  public getURLParameters(){

    const dict=new Dictionary<string, string>();{
      dict.setValue('since', this.since.toString())
      dict.setValue('until', this.until.toString())
    }
    return dict
  }

  
}