import { Chess } from "chess.js";
import { useEffect, useRef, useState } from "react";

export default function usePositionList(initialPosition:string){

    const [cursor, setCursor] = useState<number>(0)
    const cursorRef = useRef<number>(cursor)

    const [positionList, setPositionList] = useState<string[]>([initialPosition])
    const positionListRef = useRef(positionList)

    function addMove(lan:string){

        let chess = new Chess(positionListRef.current[positionListRef.current.length - 1])
        chess.move(lan)

        positionListRef.current =[...positionListRef.current, chess.fen()]
        cursorRef.current ++

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

    return {addMove, positionList, cursor, navigateBack, navigateForward}


}