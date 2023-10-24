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
	colorPlayerCanControl: cg.Color|null
	fen:string
	lastMove: undefined|cg.Key[]
	orientation: cg.Color
	afterMove: ()=>void
	parentRef:React.MutableRefObject<null|HTMLElement>
}

export default function Board(props:Props) {

	const [length, setLength]=useState(0)
	const chess=new Chess(props.fen)

	const SQUARES:string[]=['a8' , 'b8' , 'c8' , 'd8' , 'e8' , 'f8' , 'g8' , 'h8' , 
	'a7' , 'b7' , 'c7' , 'd7' , 'e7' , 'f7' , 'g7' , 'h7' , 'a6' , 'b6' , 'c6' , 'd6' , 
	'e6' , 'f6' , 'g6' , 'h6' , 'a5' , 'b5' , 'c5' , 'd5' , 'e5' , 'f5' , 'g5' , 'h5' , 
	'a4' , 'b4' , 'c4' , 'd4' , 'e4' , 'f4' , 'g4' , 'h4' , 'a3' , 'b3' , 'c3' , 'd3' , 
	'e3' , 'f3' , 'g3' , 'h3' , 'a2' , 'b2' , 'c2' , 'd2' , 'e2' , 'f2' , 'g2' , 'h2' , 
	'a1' , 'b1' , 'c1' , 'd1' , 'e1' , 'f1' , 'g1' , 'h1']

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
	 * @param chess chess object encoding the current position
	 * @returns an object encapsulating the possible destinations of 
	 * each piece for chessground
	 */
	function getDests(chess:Chess, colorPlayerCanControl:cg.Color|null)
	:Map<cg.Key, cg.Key[]>{
		
		let dests:Map<cg.Key, cg.Key[]>=new Map();
		let colorToMove:cg.Color=chess.turn()=='w' ? 'white' : 'black'

		if (colorPlayerCanControl==null || colorToMove!=colorPlayerCanControl){
			return dests
		}
	
		SQUARES.forEach(square=>{
			const moves = chess.moves({square: square as Square, verbose: true});
			if (moves.length){
				dests.set(square as cg.Key, moves.map(
					(move:any) => move.to)
				);
			}
		})
		
		return dests
	}

	/**
	 * 
	 * @returns the config object required by Chessground
	 */
	function getConfig():Config{

		const turnColor:cg.Color = props.fen.split(' ')[1]=='w'
		? 'white' : 'black'
		
		return {
			fen: props.fen,
			orientation: props.orientation,
			coordinates:false,
			turnColor: turnColor,
			lastMove: props.lastMove,
			movable: {
				free: false,
				dests: getDests(chess, props.colorPlayerCanControl)
			}
		}
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
