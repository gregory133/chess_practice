import React, { useEffect, useRef, useState } from 'react'
import styles from './Stockfish.module.scss'
import { Switch } from '@mui/material'
import { Chess } from 'chess.js'

interface Props{

    fen:string

}

export default function Stockfish(props:Props) {

    const NUM_TOP_MOVES = 5
    const DEPTH = 20

    const stockfishRef = useRef<null | Worker>(null)
    const [topMoves, setTopMoves] = useState<{move:string, evalType:'cp'|'mate', evalValue:number, depth:number}[]>([])
    const topMovesRef = useRef<{move:string, evalType:'cp'|'mate', evalValue:number, depth:number}[]>(
        new Array(NUM_TOP_MOVES))

    const [isDisabled, setIsDisabled] = useState(false)

    useEffect(()=>{

        initStockfish()

    }, [])

    useEffect(()=>{

        getTopMoves(props.fen, NUM_TOP_MOVES)
            
    }, [props.fen])

    useEffect(()=>{
        console.log('top moves: ', topMoves)
    }, [topMoves])

    /**called to initialise Stockfish */
    function initStockfish(){

        stockfishRef.current = new Worker('/stockfish.js')
        stockfishRef.current.onmessage = onStockfishMessage

        stockfishRef.current.postMessage('uci')

    }

    function onStockfishMessage(event:any){

        const message : string = event.data

        if (message.includes('info')){

            const depth = parseInt(message.split(' depth ')[1].split(' ')[0])
            const multipv = parseInt(message.split(' multipv ')[1].split(' ')[0])
            const evalType = message.split(' score ')[1].split(' ')[0]
            const evalValue = parseInt(message.split(' score ')[1].split(' ')[1])
            const moveLan = message.split(' pv ')[1].split(' ')[0]

            topMovesRef.current[multipv - 1] = {move:moveLan, 
                evalType:evalType as 'cp'|'mate', evalValue:evalValue, depth:depth} 
            setTopMoves([...topMovesRef.current])

        }
    }

    function getTopMoves(fen:string, numTopMoves:number){

        
        
        stockfishRef.current?.postMessage(`setoption name multipv value ${numTopMoves}`)
        stockfishRef.current?.postMessage(`position fen ${fen}`)
        stockfishRef.current?.postMessage(`go depth ${DEPTH}`)

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
                        topMoves.map(topMove=>{

                            return (
                                <div className={styles.topMove}>

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
