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
		// this.stockfish.postMessage(`position fen ${fen}`)
		// this.stockfish.postMessage("go depth 14");

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
   * @param thinkingTime time take by the engine to think
   * @param fen 
   */
  public getEval(fen:string, thinkingTime:number=500):Promise<Eval>{

    return new Promise((res, rej)=>{
      this.stockfish.onmessage=onLocalMessage
      this.stockfish.postMessage(`position fen ${fen}`)
  		this.stockfish.postMessage("go depth 14");

      function onLocalMessage(event:MessageEvent<any>){
        parseMessage(event, res)
      }
    }) 
    
    /**
     * parses a stockfish message to get the evaluation and resolves the promise if needed 
     * @param event 
     * @param res 
     */
    function parseMessage(event:MessageEvent<any>, 
      res:(value: Eval | PromiseLike<Eval>) => void){
    
        const data:string[]=event.data.split(' ')
        if (data[0]=='bestmove'){
   
        }
        else if (data[0]=='info'){
          const type=data[8]
          const value=parseInt(data[9])
          const evaluation={type:type, value:value} as Eval
          console.log(evaluation); 
        }
    }
  }

  
}