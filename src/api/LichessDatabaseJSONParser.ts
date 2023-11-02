import Winrate from "../classes/Winrate"

export default class LichessDatabaseJSONParser{

  private json:any

  public constructor(json:any){
    this.json=json
  }

  public setJson(json:any){
    this.json=json
  }

  /**
   * 
   * @param json 
   * @returns the opening name described by the json object
   */
  public extractOpeningName(){
    try{
      return this.json.opening.name as string|null
    }
    catch (err){return null}
    
  }

  /**
   * extracts and returns the winrate object associated with the given json
   * response
   * @param json 
   */
  public extractWinrate():Winrate{
    const white=this.json.white
    const black=this.json.black
    const draws=this.json.draws
    const sum=white+black+draws
    return new Winrate(black/sum, white/sum)
  }

  public extractNumMovesInDB():number{
    return this.json.moves.length
  }

  public extractNumGamesInDB():number{
    return this.json.white+this.json.black+this.json.draws
  }

}