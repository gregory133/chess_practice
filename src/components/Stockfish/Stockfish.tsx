import React, { useEffect, useReducer, useRef, useState } from 'react'
import styles from './Stockfish.module.scss'
import { CircularProgress, Switch } from '@mui/material'
import { Chess } from 'chess.js'
import ChessUtil from '../../classes/ChessUtil'
import EvalBar from '../EvalBar/EvalBar'
import PsychologyIcon from '@mui/icons-material/Psychology';

interface Props{fen:string}
type StockfishFSMState = 'UNINITIALIZED' | 'INITIALIZED' | 'ANALYSING' | 'FINISHED_ANALYSING' | 'STOPPING'

type StockfishFSMActions = 'send' | 'receive'

export default function Stockfish(props:Props) {

    const NUM_TOP_MOVES = 5
    const MAX_DEPTH = 15

    const stockfishRef = useRef<null | Worker>(null)
    const [topMoves, setTopMoves] = useState<{move:string, evalType:'cp'|'mate', evalValue:number}[]>([])
    const topMovesRef = useRef<{move:string, evalType:'cp'|'mate', evalValue:number}[]>(
        new Array(NUM_TOP_MOVES))

    const [stockfishFSM, dispatchStockfishFSM] = useReducer(stockfishFSMReducer, {fsmState:'UNINITIALIZED', fen:''})
    const stockfishFSMRef = useRef(stockfishFSM)
    const fenRef = useRef(props.fen)
    const [isDisabled, setIsDisabled] = useState(false)

    /**reducer function for the stockfish FSM */
    function stockfishFSMReducer(state:{fsmState:StockfishFSMState, fen:string}, action:{type:StockfishFSMActions, 
        payload:{message:string, fen:string}})
    :{fsmState:StockfishFSMState, fen:string}{

        const fsmState = state.fsmState
        const stateFen = state.fen
        const actionFen = action.payload.fen
        const message = action.payload.message

        const fenChanged = stateFen != actionFen

        // console.log(stateFen, actionFen)
        // console.log(fenChanged)
        
        if (fsmState == 'UNINITIALIZED'){
            if (action.type == 'send' && message == `setoption name MultiPV value ${NUM_TOP_MOVES}`) 
                return {fsmState:'INITIALIZED', fen:stateFen}
        }
        else if (fsmState == 'INITIALIZED'){
            if (action.type == 'send' && message == `go depth ${MAX_DEPTH}`) 
                return {fsmState:'ANALYSING', fen:stateFen}
            if (fenChanged) return {fsmState: 'INITIALIZED', fen:actionFen}
        }
        else if (fsmState == 'ANALYSING'){

            // console.log('checkmate: ', ChessUtil.isCheckmate(actionFen))
        
            if (action.type == 'receive'){
                if (!ChessUtil.isCheckmate(actionFen)){
                    parseAnalysisMessages(message)
                    if (message.split(' ')[0] == 'bestmove') return {fsmState:'FINISHED_ANALYSING', fen:actionFen};
                }
                else{
                    setTopMoves([])
                    return {fsmState:'FINISHED_ANALYSING', fen:actionFen}
                }
                    
            } 
            
            if (fenChanged){
                if (action.type == 'send' && message == 'stop') return {fsmState: 'STOPPING', fen:actionFen}
            }
        }
        else if (fsmState == 'FINISHED_ANALYSING'){
            if (fenChanged) return {fsmState:'ANALYSING', fen: actionFen}
        }
        else if (fsmState == 'STOPPING'){
            if (action.type == 'receive' && message.split(' ')[0] == 'bestmove'){
                return {fsmState:'ANALYSING', fen:actionFen}
            }
        }

        // console.log(state)
        return state

    }

    /**called to parse the messages received from stockfish during analysis */
    function parseAnalysisMessages(message:string){

        const whoseTurnToPlay = props.fen.split(' ')[1]
        // console.log(message)

        if (message.split(' ')[0] == 'info'){

            let pv : number
            let bestMove : string = ''

            try{
                pv = parseInt(message.split(' multipv ')[1].split(' ')[0]) 
                const evaluation : {type:'cp'|'mate', value:number} = message.includes('mate') 
                    ? {type: 'mate', value: parseInt(message.split(' mate ')[1].split(' ')[0])} 
                    : {type: 'cp', value: parseInt(message.split(' cp ')[1].split(' ')[0])} 
                bestMove = message.split(' pv ')[1].split(' ')[0]

                try{
                    bestMove = lanToSan(props.fen, bestMove)
                }
                catch (err){
                    console.log('failed to convert lan to san')
                }

                if (whoseTurnToPlay=='b'){
                    evaluation.value *= -1
                }
            

                topMovesRef.current[pv-1] = {move: bestMove, evalType: evaluation.type, 
                    evalValue: evaluation.value}
                setTopMoves([...topMovesRef.current])
            }
            catch (err){
                // console.log(fenRef.current)
                // console.log(stockfishFSMRef.current.fen)
                console.log('mate?')
            } 
        }
    }

    useEffect(()=>{

        initStockfish()

        document.addEventListener("keydown", function (event) {
            if (event.key === "g") {
                send(`position fen ${fenRef.current}`)
                send(`go depth ${MAX_DEPTH}`)
                event.preventDefault()
            }
            else if (event.key === "s") {
                send('stop')
                event.preventDefault()
            }
        });

    }, [])

    useEffect(()=>{
        stockfishFSMRef.current = stockfishFSM
        // console.log('fresh', stockfishFSM)
        // console.log(stockfishFSM)

        if (stockfishFSM.fsmState == 'INITIALIZED' || stockfishFSM.fsmState == 'ANALYSING'){
            send(`position fen ${stockfishFSM.fen}`)
            send(`go depth ${MAX_DEPTH}`)
        }

    }, [stockfishFSM])

    useEffect(()=>{
        fenRef.current = props.fen
        send('stop')
    }, [props.fen])

    

    /**called to initialise Stockfish */
    function initStockfish(){

        stockfishRef.current = new Worker('/stockfish.js')
        stockfishRef.current.onmessage = onStockfishMessage
 
        // send('uci')
        send(`setoption name MultiPV value ${NUM_TOP_MOVES}`)
        // send('isready')
    }


    /**
     * sends a uci message to stockfish
     */
    function send(message:string){
        // console.log(message)
        // if (message.split(' ')[0] == 'stop') console.log(message)
        stockfishRef.current?.postMessage(message)
        dispatchStockfishFSM({type: 'send', payload: {message:message, fen:fenRef.current}})
    }

    /**receives a message from stockfish. Contains logic that needs to be done when received a message */
    function receive(message:string){
        
        // console.log(message)
        // if (message.split(' ')[0] == 'bestmove') console.log(message)
        

        dispatchStockfishFSM({type: 'receive', payload: {message:message, fen:fenRef.current}})
    }

    /**called when a stockfish message is received */
    function onStockfishMessage(event:any){
        const message : string = event.data 
        // console.log(message)
        receive(message)
    }

    function onChangeDisableSwitch(event:any, checked:boolean){
        setIsDisabled(!checked)
    }

    /**utility function used to convert a LAN move into its SAN move */
    function lanToSan(fen:string, lan:string):string{

        let chess = new Chess(fen)
        chess.move(lan)
        return chess.history()[0]
    }

    function truncateTo1Decimal(num:number) {
        return Math.trunc(num * 10) / 10;
    }

    function stringifyEval(turnColor:'w'|'b', evalType:'mate'|'cp', evalValue:number):string{

        // console.log(evalType, evalValue)

        if (evalType == 'mate'){
            if (turnColor == 'w') return `# ${evalValue}`; else return `# ${evalValue}`
            
        }
        else if (evalType == 'cp'){

            let returnString = `${evalValue/100}`

            if (returnString.charAt(0) != '-'){
                returnString = '+' + returnString
            }
            return returnString
        }
        return ''

    }

    return (
        <div className={styles.main}>

            <div className={styles.bar}>

                <div className={styles.title}>
                    <div className={styles.titleStockfish}>
                        <PsychologyIcon sx={{margin: '0 1rem 0 0'}}/>
                        Stockfish Top Moves
                    </div>
                    
                    <Switch onChange={onChangeDisableSwitch} defaultChecked/>
                </div>

                <div className={styles.topMovesList}>

                    {
                    topMoves.map((topMove, key)=>{

                        const stringifiedEval = stringifyEval(props.fen.split(' ')[1] as 'b'|'w', 
                        topMove.evalType, topMove.evalValue)

                        return (
                            <div key={key} className={styles.topMove}>

                                {
                                stockfishFSM.fsmState == 'ANALYSING' || stockfishFSM.fsmState == 'FINISHED_ANALYSING'
                                    ?   <>
                                            <div className={styles.san}>
                                                {topMove.move}
                                            </div>
                                            
                                            <div className={styles.eval}>
                                                {stringifiedEval}
                                            </div>
                                            <EvalBar evaluation={stringifiedEval}/>
                                        </>                      
                                    : <CircularProgress size='2rem' sx={{color: '#bdbdbd'}} />
                                }        
                                
                            </div>
                        )
                    })
                    }

                </div>

            </div>

        </div>
    )

}
