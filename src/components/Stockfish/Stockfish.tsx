import React, { useEffect, useReducer, useRef, useState } from 'react'
import styles from './Stockfish.module.scss'
import { CircularProgress, Switch } from '@mui/material'
import { Chess } from 'chess.js'
import ChessUtil from '../../classes/ChessUtil'

interface Props{fen:string}
type StockfishFSMState = 'UNINITIALIZED' | 'INITIALIZED' | 'ANALYSING' | 'STOPPING'

type StockfishFSMActions = 'send' | 'receive'



export default function Stockfish(props:Props) {

    const NUM_TOP_MOVES = 5
    // const DEPTH = 20

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
            if (action.type == 'send' && message == 'go infinite') 
                return {fsmState:'ANALYSING', fen:stateFen}
            if (fenChanged) return {fsmState: 'INITIALIZED', fen:actionFen}
        }
        else if (fsmState == 'ANALYSING'){
            // console.log('fc', fenChanged)
            if (action.type == 'receive') parseAnalysisMessages(message)
            
            if (fenChanged){
                if (action.type == 'send' && message == 'stop') return {fsmState: 'STOPPING', fen:actionFen}
            }
        }
        else if (fsmState == 'STOPPING'){
            if (action.type == 'receive' && message.split(' ')[0] == 'bestmove'){
                return {fsmState:'ANALYSING', fen:actionFen}
            }
        }

        return state

    }

    /**called to parse the messages received from stockfish during analysis */
    function parseAnalysisMessages(message:string){

        // console.log('parsing')
        const whoseTurnToPlay = props.fen.split(' ')[1]
        // console.log(message)

        if (message.split(' ')[0] == 'info'){
            const pv : number = parseInt(message.split(' multipv ')[1].split(' ')[0]) 
            const evaluation : {type:'cp'|'mate', value:number} = message.includes('mate') 
                ? {type: 'mate', value: parseInt(message.split(' mate ')[1].split(' ')[0])} 
                : {type: 'cp', value: parseInt(message.split(' cp ')[1].split(' ')[0])} 
            let bestMove = message.split(' pv ')[1].split(' ')[0]
            
            
            try{
                bestMove = lanToSan(props.fen, bestMove)
            }
            catch (err){
                console.log('failed to convert lan to san')
            }
            

            topMovesRef.current[pv-1] = {move: bestMove, evalType: evaluation.type, evalValue: evaluation.value}
            setTopMoves([...topMovesRef.current])
        }
    }

    useEffect(()=>{

        initStockfish()

        document.addEventListener("keydown", function (event) {
            if (event.key === "g") {
                send(`position fen ${fenRef.current}`)
                send('go infinite')
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
        console.log(stockfishFSM)

        if (stockfishFSM.fsmState == 'INITIALIZED'){
            send(`position fen ${stockfishFSM.fen}`)
            send('go infinite')
        }
        else if (stockfishFSM.fsmState == 'ANALYSING'){
            send(`position fen ${stockfishFSM.fen}`)
            send('go infinite')
        }

    }, [stockfishFSM])

    useEffect(()=>{
        // console.log('time of fen update', stockfishFSMRef.current)
        fenRef.current = props.fen
        send('stop')
        // send(`position fen ${props.fen}`)
        // send('go infinite')
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
        stockfishRef.current?.postMessage(message)
        dispatchStockfishFSM({type: 'send', payload: {message:message, fen:fenRef.current}})
    }

    /**receives a message from stockfish. Contains logic that needs to be done when received a message */
    function receive(message:string){
        
        // console.log(message)
        if (message.split(' ')[0] == 'bestmove') console.log(message)
        if (message.split(' ')[0] == 'stop') console.log(message)

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

        if (evalType == 'mate'){
            return `M ${evalValue}` 
        }
        else if (evalType == 'cp'){

            let returnString = ''

            if (turnColor == 'w'){
                returnString = `${evalValue/100}`
            }
            else if (turnColor == 'b'){
                returnString = `${-1 * evalValue/100}` 
            }

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
                    Stockfish Top Moves
                    <Switch onChange={onChangeDisableSwitch} defaultChecked/>
                </div>

                <div className={styles.topMovesList}>

                    {
                        topMoves.map((topMove, key)=>{

                            return (
                                <div key={key} className={styles.topMove}>

                                    {
                                        stockfishFSM.fsmState == 'ANALYSING' 
                                            ?  <>
                                                <div className={styles.eval}>
                                                    {stringifyEval(props.fen.split(' ')[1] as 'b'|'w', 
                                                    topMove.evalType, topMove.evalValue)}
                                                </div>
                                                {topMove.move}
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
