import Chessground from '@react-chess/chessground'
import React, {useEffect, useState, useMemo} from 'react'
import { Chess, Square } from 'chess.js'
import { Config } from 'chessground/config';
import * as cg from 'chessground/types.js';
import PromotionDialog from './PromotionDialog';
import "../styles/chessground.base.css";
import "../styles/chessground.brown.css";
import "../styles/chessground.cburnett.css";
import ResponsiveSquare from './ResponsiveSquare';

interface Props{
	isMovable:boolean
	fen:string
	lastMove: null|cg.Key[]
	orientation: cg.Color
	afterMove: ()=>void
	parentRef:React.MutableRefObject<null|HTMLElement>
}

export default function Board(props:Props) {

	const [length, setLength]=useState(0)
	const chess=new Chess(props.fen)

	/**
	 * 
	 * @returns the smaller of the dimensions of the parent element
	 * or -1 if the parentRef is null
	 */
	function getSmallerParentDimension(){
		if (props.parentRef.current){
			const parentWidth=props.parentRef.current.offsetWidth
			const parentHeight=props.parentRef.current.offsetHeight
			const smallerParentDimension=(parentHeight>parentWidth)
				?parentWidth
				:parentHeight
			return smallerParentDimension
		}	

		return -1
		
	}

	function adjustBoardLength(){
		const smallerParentDimension=getSmallerParentDimension()
		
		setLength(smallerParentDimension)
	}

	/**
	 * 
	 * @returns the config object required by Chessground
	 */
	function getConfig():Config{

		
		return {coordinates:false}
	}

	useEffect(()=>{
		window.addEventListener('resize', ()=>{
			adjustBoardLength()
		})
	}, [])


	useEffect(()=>{
		adjustBoardLength()
	}, [props.parentRef])

	return (

		<ResponsiveSquare child={
			<Chessground config={getConfig()} contained={true}/>
		} 
		squareLength={length}/>
	)

}
