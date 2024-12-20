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
  
  public getURL() : URL{

    const url = new URL('https://explorer.lichess.ovh/lichess')
    url.searchParams.set('since', this.since.toString())
    url.searchParams.set('until', this.until.toString())

    return url

  }

  
}