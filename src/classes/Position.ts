export default class Position{

  public fen:string
  public lastLAN: string

  public constructor(fen:string, lastLAN:string){
    this.fen=fen
    this.lastLAN=lastLAN
  }

}