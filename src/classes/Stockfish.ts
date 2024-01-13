export interface Eval{
  value:number
  type:'cp'|'mate'
}

interface Evaluation{
  eval:Eval, 
  bestMove:string
}

/**
 * implements the singleton pattern
 */
export default class Stockfish{

  private static onStockfishMessage(event:any, res: any, endTime:number, fen:string, 
    bestEvaluationSoFar:Evaluation){
      if (Date.now()>=endTime){
        res(bestEvaluationSoFar)
        
        return
      }

      const message=event.data
      const messageMode=message.split(' ')[0]

      if (messageMode=='bestmove'){
        if (bestEvaluationSoFar){
          res(bestEvaluationSoFar)
        }
      }
      else if (messageMode=='info'){
        const extract=(message:string, thingToExtract: string)=>{
          if (message.includes(thingToExtract)){
            return message.split(` ${thingToExtract} `)[1].split(' ')[0]
          }
        }
    
        const evaluationType:'cp'|'mate'=message.includes('cp') ? 'cp' : 'mate'
        
        const bestMove:string=extract(message, 'pv')!
        const evaluationValue=extract(message, evaluationType)!
        const value=this.rectifyEvalValue(Number.parseInt(evaluationValue), fen)

        const evaluation={eval: {value: value, type: evaluationType}, 
        bestMove: bestMove}

        bestEvaluationSoFar.bestMove=bestMove
        bestEvaluationSoFar.eval={value: evaluation.eval.value, type: evaluation.eval.type}
       
      }
      
  }

  private static rectifyEvalValue(value:number, fen:string):number {
    const isBlackToMove=fen.split(' ')[1]=='b'

    if (isBlackToMove){
      return -1*value
    }
    return value

  }

  /**
   * given a FEN string, returns an object representing a stockfish evaluation
   * @param thinkingTime time taken by the engine to think in milliseconds
   * @param fen 
   */
  public static getEval(fen:string, thinkingTime:number=1200):Promise<{eval:Eval, bestMove:string}>{

    const startTime=Date.now()
    const endTime=startTime+thinkingTime

    const bestEvaluationSoFar:Evaluation={eval: {value: 0, type: 'cp'}, bestMove: ''}

    return new Promise((res, rej)=>{
      let stockfish=new Worker('/chess_opening_practice/stockfish.js')
      const depth=14
      stockfish.onmessage=(event:any)=>{Stockfish.onStockfishMessage(event, res, endTime, fen, 
        bestEvaluationSoFar)}
      stockfish.postMessage(`position fen ${fen}`)
      stockfish.postMessage(`go depth ${depth}`)
    })

  }

  
}