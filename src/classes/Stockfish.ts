export default class Stockfish{

  private static instance:Stockfish|null

  private constructor(){
    
  }

  public static getInstance():Stockfish{
    if (!this.instance){
      this.instance=new Stockfish()
    }
    return this.instance
  }

  public getTopMoves(fen:string, numTopMoves:number) : Promise<any>{
  
    let stockfish = new Worker('/stockfish.js')
    const DEPTH = 20

    stockfish.onmessage = (event:any)=>{
      
      const message : string = event.data

      console.log(message)

    }

    stockfish.postMessage('uci')
    stockfish.postMessage(`position fen ${fen}`)
    stockfish.postMessage(`setoption name MultiPV value ${numTopMoves}`)
    stockfish.postMessage(`go depth ${DEPTH}`)


    return new Promise((resolve, reject)=>{

            

    })

  }

}