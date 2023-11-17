export interface Eval{
  value:number
  type:string
}

/**
 * implements the singleton pattern
 */
export default class Stockfish{

  private static instance?:Stockfish
  private stockfish=new Worker('/stockfish.js')

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
  public getEval(fen:string, thinkingTime:number=500):Promise<Eval>{

    return new Promise((res, rej)=>{
      this.stockfish.onmessage=onLocalMessage
      this.stockfish.postMessage(`position fen ${fen}`)
  		this.stockfish.postMessage("go depth 14");

      let mostAccurateEval={value: 0, type: ''} as Eval
      const startTime=Date.now()

      function onLocalMessage(event:MessageEvent<any>){
        const receivedEval:Eval|undefined=parseMessage(event, mostAccurateEval,
          fen.split(' ')[1] as 'w'|'b', res)
        if (receivedEval){
          mostAccurateEval=receivedEval
          if (timeExceeded(startTime, thinkingTime)){
            res(mostAccurateEval)
          }
        }
      }
      
    }) 
    
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
    function parseMessage(event:MessageEvent<any>, previousEval:Eval,
    turnToMove: 'w'|'b', res:(value: Eval | PromiseLike<Eval>) => void):
    Eval|undefined{
    
      const data:string[]=event.data.split(' ')
      if (data[0]=='bestmove'){
        res(previousEval)
      }
      else if (data[0]=='info'){
        // console.log(data);
        const type=data[8]
        let value=parseInt(data[9]);
        (turnToMove=='b') ? value*=-1 : value*=1
        const evaluation={type:type, value:value} as Eval
        return evaluation
      }
    }
  }

  
}