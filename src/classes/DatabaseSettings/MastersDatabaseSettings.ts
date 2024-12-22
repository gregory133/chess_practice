import { Dictionary } from "typescript-collections";
import DatabaseSettings from "../../interfaces/DatabaseSettings";
import { Database } from "../../api/DBApi";

export default class MastersDatabaseSettings implements DatabaseSettings{

  private fen:string
  private since:number
  private until:number

  public constructor(fen:string, since:number, until:number){
    this.fen = fen
    this.since = since
    this.until = until
  }

  public getDatabaseName():Database{
    return 'masters'
  }
  
  public getURL() : URL{

    const url = new URL('https://explorer.lichess.ovh/masters')
    url.searchParams.set('fen', this.fen)
    url.searchParams.set('since', this.since.toString())
    url.searchParams.set('until', this.until.toString())

    return url

  }

  
}