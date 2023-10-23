import Chessground from '@react-chess/chessground'
import React, {useEffect, useState, useMemo} from 'react'
import { Chess, Square } from 'chess.js'
import * as cg from 'chessground/types.js';
import PromotionDialog from './PromotionDialog';
import "../styles/chessground.base.css";
import "../styles/chessground.brown.css";
import "../styles/chessground.cburnett.css";
export default function Board() {

	const SQUARES:string[]=['a8' , 'b8' , 'c8' , 'd8' , 'e8' , 'f8' , 'g8' , 'h8' , 
	'a7' , 'b7' , 'c7' , 'd7' , 'e7' , 'f7' , 'g7' , 'h7' , 'a6' , 'b6' , 'c6' , 'd6' , 
	'e6' , 'f6' , 'g6' , 'h6' , 'a5' , 'b5' , 'c5' , 'd5' , 'e5' , 'f5' , 'g5' , 'h5' , 
	'a4' , 'b4' , 'c4' , 'd4' , 'e4' , 'f4' , 'g4' , 'h4' , 'a3' , 'b3' , 'c3' , 'd3' , 
	'e3' , 'f3' , 'g3' , 'h3' , 'a2' , 'b2' , 'c2' , 'd2' , 'e2' , 'f2' , 'g2' , 'h2' , 
	'a1' , 'b1' , 'c1' , 'd1' , 'e1' , 'f1' , 'g1' , 'h1']
	
	const BOARD_SIZE_VW=45
	const DISABLED_BOARD_OPACITY=0.5

	// const stockfish=useMemo(()=>{return new Worker('/stockfish.js')}, [])
	const [promotionDialogVisible, setPromotionDialogVisible]=useState<boolean>(
		false
	)
  const fen="8/5P2/2k5/8/8/8/2K5/8 w - - 0 1"
	let [chess]=useState<Chess>(new Chess(fen))
	const [lastMove, setLastMove]=useState<cg.Key[]>([])
	const [promotionFile, setPromotionFile]=useState<number>(0)
	const [position, setPosition]=useState<string>(fen)
	const [boardOpacity, setBoardOpacity]=useState<number>(1)

	function getFile(square:cg.Key){
		const firstLetter=square.charAt(0);
		const fileDict:Record<string, number>={
			'a':0,
			'b':1,
			'c':2,
			'd':3,
			'e':4,
			'f':5,
			'g':6,
			'h':7
		}
		return fileDict[firstLetter]
	}

	function isMovePromotion(fen:string, orig:string,
	dest:string):boolean{
		const tempChess=new Chess(fen)
		// console.log(tempChess.ascii());
		const move=tempChess.move({from:orig, to:dest, promotion:'q'}, undefined)

		return move.flags.includes('p')
	}

	function getMovable(chess:Chess):{
	events?:{after:(orig: cg.Key, dest: cg.Key, metadata: 
	cg.MoveMetadata) => void}, dests?: cg.Dests, free?:boolean}
	{
		if (chess.turn()=='b'){
			return {}
		}
		let dests:Map<cg.Key, cg.Key[]>=new Map();
		SQUARES.forEach(square=>{
			const moves = chess.moves({square: square as Square, verbose: true});
			if (moves.length){
				dests.set(square as cg.Key, moves.map(
					(move:any) => move.to)
				);
			}
		})
		
		return {dests:dests, free:false, events:{after:afterMove}}
	}

	const choosePromotion=(symbol:'q'|'r'|'n'|'b')=>{

		const fileDict:Record<number, string>={
			0:'a',
			1:'b',
			2:'c',
			3:'d',
			4:'e',
			5:'f',
			6:'g',
			7:'h'
		}		

		const from=fileDict[promotionFile]+'7'
		const to=fileDict[promotionFile]+'8'

		setLastMove([from as cg.Key, to as cg.Key])
		chess.move({from:from, to:to, promotion:symbol})
		setPosition(chess.fen())
		setPromotionDialogVisible(false)
	}

	function afterMove(orig: cg.Key, dest: cg.Key, metadata: 
	cg.MoveMetadata):void{

		if (isMovePromotion(chess.fen(), orig, dest)){
			setPromotionFile(getFile(orig))
			setPromotionDialogVisible(true);
		}
		else{
			setLastMove([orig, dest])
			chess.move(orig+dest)
			setPosition(chess.fen())
		}
	}

	function isDrawOrMate(){
		return chess.isDraw() || chess.isCheckmate()
	}

	useEffect(()=>{
		if (promotionDialogVisible){
			setBoardOpacity(DISABLED_BOARD_OPACITY)
		}
		else{
			setBoardOpacity(1)
		}
	}, [promotionDialogVisible])

	useEffect(()=>{
		setPosition(fen)
		setLastMove([])
		chess.load(fen)
	}, [fen])

	return (
		<div style={{
			position: 'relative',
			height: '100%',
			width: '100%',
		}}>
			<div style={{
				opacity: boardOpacity,
				position: 'relative',
				height: '100%',
				width: '100%',
				}}>
				<Chessground
					contained={true} 
					config={{
						lastMove:lastMove,
						viewOnly:promotionDialogVisible,
						coordinates:false,
						turnColor:position.split(' ')[1]=='w'? 'white' : 'black',
						fen:position,
						orientation:'white',
						movable:getMovable(chess),
						drawable:{
							enabled:!promotionDialogVisible,
							defaultSnapToValidMove:false
						}
				}}/>
			</div>
			
			<PromotionDialog promotionChoiceFunction={choosePromotion} 
			isVisible={promotionDialogVisible}
			top='0px' file={promotionFile}/>

		</div>

	)
}
