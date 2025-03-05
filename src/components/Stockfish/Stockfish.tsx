import React, { useEffect, useRef, useState } from 'react'

interface Props{

    fen:string

}

export default function Stockfish(props:Props) {

    const stockfishRef = useRef<null | Worker>(null)
    const [topMoves, setTopMoves] = useState<{move:string, evalType:string, evalValue:number, depth:number}[]>([])
    const topMovesRef = useRef<{move:string, evalType:string, evalValue:number, depth:number}[]>(
        new Array(5))

    useEffect(()=>{

        initStockfish()

    }, [])

    useEffect(()=>{

        getTopMoves(props.fen, 5)
            
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
        // console.log(message)

        if (message.includes('info')){

            const depth = parseInt(message.split(' depth ')[1].split(' ')[0])
            const multipv = parseInt(message.split(' multipv ')[1].split(' ')[0])
            const evalType = message.split(' score ')[1].split(' ')[0]
            const evalValue = parseInt(message.split(' score ')[1].split(' ')[1])
            const moveLan = message.split(' pv ')[1].split(' ')[0]

            // console.log(depth, multipv, evalType, evalValue, moveLan)
        
            topMovesRef.current[multipv - 1] = {move:moveLan, evalType:evalType, evalValue:evalValue, depth:depth} 
            setTopMoves([...topMovesRef.current])

        }
    }

    function getTopMoves(fen:string, numTopMoves:number){

        const DEPTH = 10
        
        stockfishRef.current?.postMessage(`setoption name multipv value ${numTopMoves}`)
        stockfishRef.current?.postMessage(`position fen ${fen}`)
        stockfishRef.current?.postMessage(`go depth ${DEPTH}`)

    }
    
    return (
        null
    )

}
