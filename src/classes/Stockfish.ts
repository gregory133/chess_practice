import { Eval, Evaluation } from "../components/Stockfish/StockfishComponent"

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

  public getEval(fen:string):Promise<Evaluation>{

    return new Promise((resolve, reject)=>{
      let stockfish=new Worker('/stockfish.js')
      const depth=10
      
      stockfish.onmessage=(event:any)=>{
        const message:string=event.data
        // console.log(message);
        if (message.includes(`depth ${depth}`)){
          const bestMove=message.split(' pv ')[1].split(' ')[0]
          let theEval:Eval={value: -1, type: 'cp'}
          if (message.includes('mate')){
            const numMovesToMate=message.split(' mate ')[1].split(' ')[0]
            theEval={value: Number(numMovesToMate), type: 'mate'}
          }
          else if (message.includes('cp')){
            const numCentipawn=message.split(' cp ')[1].split(' ')[0]
            theEval={value: Number(numCentipawn), type: 'cp'}
          }
          let evaluation:Evaluation={eval:theEval, bestMove:bestMove}
          resolve(evaluation)
        }
      }

      stockfish.postMessage('uci')
      stockfish.postMessage(`position fen ${fen}`)
      stockfish.postMessage(`go depth ${depth}`)
    })
  }

}