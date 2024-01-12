export interface Eval{
  value:number
  type:string
}

/**
 * implements the singleton pattern
 */
export default class Stockfish{

  private static onStockfishMessage(event:any, res: any, endTime:number){
    const evaluation=Stockfish.parseStockfishMessage(event.data)
    if (evaluation){
      if (Date.now()>=endTime){
        res(evaluation)
      }
    }
    
  }

  private static parseStockfishMessage(message:string): {eval: Eval, bestMove: string}|null{
    if (message.split(' ')[0]!='info'){
      return null
    }
    const extract=(message:string, thingToExtract: string)=>{
      if (message.includes(thingToExtract)){
        return message.split(` ${thingToExtract} `)[1].split(' ')[0]
      }
    }

    const evaluation:string=extract(message, 'cp')!
    const bestMove:string=extract(message, 'pv')!
   
    return {eval: {value: Number.parseInt(evaluation), type: 'cp'}, bestMove: bestMove}
  }  
  
  /**
   * given a FEN string, returns an object representing a stockfish evaluation
   * @param thinkingTime time taken by the engine to think in milliseconds
   * @param fen 
   */
  public static getEval(fen:string, thinkingTime:number=1200):Promise<{eval:Eval, bestMove:string}>{

    const startTime=Date.now()
    const endTime=startTime+thinkingTime

    return new Promise((res, rej)=>{
      let stockfish=new Worker('/chess_opening_practice/stockfish.js')
      const depth=14
      stockfish.onmessage=(event:any)=>{Stockfish.onStockfishMessage(event, res, endTime)}
      stockfish.postMessage(`position fen ${fen}`)
      stockfish.postMessage(`go depth ${depth}`)
    })

  }

  
}