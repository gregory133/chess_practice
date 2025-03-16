import { Chess } from "chess.js";
import { useEffect, useRef, useState } from "react";

export default function usePositionList(initialPosition:string){

    const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

    const [cursor, setCursor] = useState<number>(0)
    const cursorRef = useRef<number>(cursor)

    const [positionList, setPositionList] = useState<string[]>([initialPosition])
    const positionListRef = useRef(positionList)

    const [colorCanMove, setColorCanMove] = useState<'white'|'black'>(getRandomColor())
    const colorCanMoveRef = useRef(colorCanMove)

    /**
     * 
     * @returns a random color 'white' or 'black'
     */
    function getRandomColor():'white'|'black'{
        return ['white','black'][Math.floor(Math.random()*2)] as 'white'|'black'
    }

    function reset(colorCanMove:'white'|'black', initialPosition = INITIAL_FEN){

        console.log(colorCanMove)
        colorCanMoveRef.current = colorCanMove
        positionListRef.current = [initialPosition]
        cursorRef.current = 0

        setColorCanMove(colorCanMoveRef.current)
        setPositionList(positionListRef.current)
        setCursor(cursorRef.current)

    }

    function addMove(lan:string){

        let chess = new Chess(positionListRef.current[positionListRef.current.length - 1])
        chess.move(lan)

        positionListRef.current =[...positionListRef.current, chess.fen()]
        cursorRef.current ++

        setPositionList(positionListRef.current)
        setCursor(cursorRef.current)
        
    }    

    /**
     * given an index, removes all positions after the given index and sets the cursor to that 
     * index value
     * @param index 
     */
    function removeAfter(index:number){

        if (index >= positionListRef.current.length - 1 || index < 0){
            return
        }

        positionListRef.current = positionListRef.current.splice(0, index+1)
        cursorRef.current = index

        setPositionList(positionListRef.current)
        setCursor(cursorRef.current)

    }

    useEffect(()=>{
        positionListRef.current = positionList
    }, [positionList])

    useEffect(()=>{
        cursorRef.current = cursor
    }, [cursor])

    function navigateBack(){
        if (cursorRef.current > 0){
            setCursor(cursorRef.current - 1)
        }
    }

    function navigateForward(){
        if (cursorRef.current < positionListRef.current.length - 1){
            setCursor(cursorRef.current + 1)
        }
    }

    return {addMove, positionList, cursor, navigateBack, navigateForward, reset, removeAfter,
        colorCanMove
    }


}