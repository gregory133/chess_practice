import React, { useEffect, useReducer, useRef, useState } from 'react'
import styles from './Stockfish.module.scss'
import { Switch } from '@mui/material'
import { Chess } from 'chess.js'
import ChessUtil from '../../classes/ChessUtil'

interface Props{fen:string}
type StockfishFSMState = 'UNINITIALIZED' | 'INITIALIZING' | 'INITIALIZED' | 'IDLE' | 'ANALYSING' | 'STOPPING' | 'STOPPED'

type StockfishFSMActions = 'send' | 'receive'



export default function Stockfish(props:Props) {

    const NUM_TOP_MOVES = 5
    // const DEPTH = 20

    const stockfishRef = useRef<null | Worker>(null)
    const [topMoves, setTopMoves] = useState<{move:string, evalType:'cp'|'mate', evalValue:number}[]>([])
    const topMovesRef = useRef<{move:string, evalType:'cp'|'mate', evalValue:number}[]>(
        new Array(NUM_TOP_MOVES))

    const [stockfishFSM, dispatchStockfishFSM] = useReducer(stockfishFSMReducer, 'UNINITIALIZED')
    const fenRef = useRef(props.fen)
    const [isDisabled, setIsDisabled] = useState(false)

    /**reducer function for the stockfish FSM */
    function stockfishFSMReducer(state:StockfishFSMState, action:{type:StockfishFSMActions, payload:any})
    :StockfishFSMState{

        if (state == 'UNINITIALIZED'){
            if (action.type == 'send' && action.payload == `setoption name MultiPV value ${NUM_TOP_MOVES}`) return 'INITIALIZING'
        }
        else if (state == 'INITIALIZING'){
            if (action.type == 'send' && action.payload == 'isready') return 'INITIALIZED'
        }
        else if (state == 'INITIALIZED'){
            if (action.type == 'receive' && action.payload == 'readyok') return 'IDLE'
        }
        else if (state == 'IDLE'){
            if (action.type == 'send' && action.payload == 'go infinite') return 'ANALYSING'
        }
        else if (state == 'ANALYSING'){
            if (action.type == 'send' && action.payload == 'stop') return 'STOPPING'
            else if (action.type == 'receive') parseAnalysisMessages(action.payload)
        }
        else if (state == 'STOPPING'){
            if (action.type == 'send' && action.payload == 'isready') return 'STOPPED'
        }
        else if (state == 'STOPPED'){
            if (action.type == 'receive' && action.payload == 'readyok') return 'IDLE'
        }

        return state

    }

    /**called to parse the messages received from stockfish during analysis */
    function parseAnalysisMessages(message:string){

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
            if (event.key === " ") {
                send(`position fen ${props.fen}`)
                send('go infinite')
                event.preventDefault()
            }
        });

    }, [])

    useEffect(()=>{
        // console.log(topMoves)
    }, [topMoves])

    useEffect(()=>{
        console.log(stockfishFSM)
    }, [stockfishFSM])

    useEffect(()=>{
        fenRef.current = props.fen
        send('stop')
        send(`position fen ${props.fen}`)
        send('go infinite')
    }, [props.fen])

    

    /**called to initialise Stockfish */
    function initStockfish(){

        stockfishRef.current = new Worker('/stockfish.js')
        stockfishRef.current.onmessage = onStockfishMessage
 
        // send('uci')
        send(`setoption name MultiPV value ${NUM_TOP_MOVES}`)
        send('isready')
    }


    /**
     * sends a uci message to stockfish
     */
    function send(message:string){
        stockfishRef.current?.postMessage(message)
        dispatchStockfishFSM({type: 'send', payload: message})
    }

    /**receives a message from stockfish. Contains logic that needs to be done when received a message */
    function receive(message:string){
        console.log(message)
        dispatchStockfishFSM({type: 'receive', payload: message})
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

                                    <div className={styles.eval}>
                                        {stringifyEval(props.fen.split(' ')[1] as 'b'|'w', 
                                        topMove.evalType, topMove.evalValue)}
                                    </div>
                                    
                                    {/* {lanToSan(props.fen, topMove.move)} */}
                                    {topMove.move}
                                    
                                </div>
                            )
                        })
                    }

                </div>

            </div>

        </div>
    )

}
