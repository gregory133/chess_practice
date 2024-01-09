export interface Eval{
  value:number
  type:string
}

/**
 * implements the singleton pattern
 */
export default class Stockfish{

  private static instance?:Stockfish
  private stockfish=new Worker('/chess_opening_practice/stockfish.js')

  /**
   * private constructor for singleton
   */
  private constructor(){
    this.stockfish.postMessage('uci')
    this.stockfish.postMessage('stop')
  }

  /**
   * static method that returns a singleton instance
   * @returns 
   */
  public static getInstance():Stockfish{
    if (!this.instance){
      this.instance=new Stockfish()
    }
    return this.instance
  }

  
  /**
   * given a FEN string, returns an object representing a stockfish evaluation
   * @param thinkingTime time taken by the engine to think in milliseconds
   * @param fen 
   */
  public getEval(fen:string, thinkingTime:number=500):Promise<{eval:Eval, bestMove:string}>{
    return new Promise((res, rej)=>{
      this.stockfish.onmessage=onLocalMessage
      this.stockfish.postMessage(`position fen ${fen}`)
  		this.stockfish.postMessage("go depth 14");

      let mostAccurateEval={value: 0, type: ''} as Eval
      let bestMove:string
      const startTime=Date.now()

      
      

      function onLocalMessage(event:MessageEvent<any>){
        const result=parseMessageForEval(event, mostAccurateEval,
        fen.split(' ')[1] as 'w'|'b', res)
        
        if (result){
          isDepthOne(event.data)
          mostAccurateEval=result.eval!
          bestMove=result.bestMove
          if (timeExceeded(startTime, thinkingTime)){
            res({eval:mostAccurateEval, bestMove: bestMove})
          }
        }
      }
      
    })
    
    function isDepthOne(message:string):boolean{
      console.log(message.includes('depth'))
      return true;
    }

   
    function timeExceeded(startTime:number, thinkingTime:number):boolean{
      return Date.now()>(startTime+thinkingTime)
    }

    /**
     * parses a stockfish message to get the evaluation and resolves the promise 
     * if needed 
     * @param event
     * @param previousEval 
     * @param res 
     * @returns an updated evaluation or undefined if no updates
     */
    function parseMessageForEval(event:MessageEvent<any>, previousEval:Eval, turnToMove: 'w'|'b', 
    res:(value: {eval:Eval, bestMove:string} | PromiseLike<{eval:Eval, bestMove:string}>) => void):
    {eval:Eval|undefined, bestMove:string}|undefined{

      const message=event.data
      const data:string[]=message.split(' ')
      
      if (data[0]=='bestmove'){
        const bestMove=message.split('bestmove ')[1].split(' ')[0]
        res({eval:previousEval, bestMove: bestMove})
      }
      else if (data[0]=='info'){
        const bestMove=message.split(' pv ')[1].split(' ')[0]
        
        const type=data[8]
        let value=parseInt(data[9]);
        (turnToMove=='b') ? value*=-1 : value*=1
        const evaluation={type:type, value:value} as Eval
        return {eval:evaluation, bestMove: bestMove}
      }
    }

  }

  
}