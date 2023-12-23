import Chessground from '@react-chess/chessground'
import React, {useEffect, useState, useMemo, useRef} from 'react'
import { Chess, Color, Move, Square } from 'chess.js'
import { Config } from 'chessground/config';
import * as cg from 'chessground/types.js';
import PromotionDialog from './PromotionDialog';
import "../styles/chessground.base.scss";
import "../styles/chessground.brown.scss";
import "../styles/chessground.cburnett.scss";
import ResponsiveSquare from './ResponsiveSquare';
import { useChessStore } from '../stores/chessStore';
import Engine from '../classes/Engine';
import { Database, fetchDB } from '../api/DBApi';
import LichessDatabaseJSONParser from '../api/LichessDatabaseJSONParser';

interface Props{
	parentRef: React.MutableRefObject<null|HTMLInputElement>
}

export default function Board(props:Props) {

	const fen=useChessStore(state=>state.currentFen)
	const lastFen=useChessStore(state=>state.lastFen)
	const setFen=useChessStore(state=>state.setCurrentFen)
	const setLastFen=useChessStore(state=>state.setLastFen)
	const orientation=useChessStore(state=>state.orientation)
	const colorPlayerCanControl=useChessStore(state=>state.colorPlayerCanControl)
	

	const engineRef=useRef(new Engine(fen))
	const jsonParserRef=useRef(new LichessDatabaseJSONParser(null))
	
	const [isPromotionVisible, setIsPromotionVisible]=useState(false)
	const [length, setLength]=useState(0)
	const [boardOpacity, setBoardOpacity]=useState<number>(1)
	const [promotionFile, setPromotionFile]=useState<number>(0)

	const addPositionToPositionList=useChessStore(state=>state.
		addPositionToPositionList)
	const positionList=useChessStore(state=>state.positionList)
	const database:Database=useChessStore(state=>state.selectedDatabase)
	const chess=new Chess(fen)

	const DISABLED_BOARD_OPACITY=0.5
	const SQUARES:string[]=['a8' , 'b8' , 'c8' , 'd8' , 'e8' , 'f8' , 'g8' , 'h8' , 
	'a7' , 'b7' , 'c7' , 'd7' , 'e7' , 'f7' , 'g7' , 'h7' , 'a6' , 'b6' , 'c6' , 'd6' , 
	'e6' , 'f6' , 'g6' , 'h6' , 'a5' , 'b5' , 'c5' , 'd5' , 'e5' , 'f5' , 'g5' , 'h5' , 
	'a4' , 'b4' , 'c4' , 'd4' , 'e4' , 'f4' , 'g4' , 'h4' , 'a3' , 'b3' , 'c3' , 'd3' , 
	'e3' , 'f3' , 'g3' , 'h3' , 'a2' , 'b2' , 'c2' , 'd2' , 'e2' , 'f2' , 'g2' , 'h2' , 
	'a1' , 'b1' , 'c1' , 'd1' , 'e1' , 'f1' , 'g1' , 'h1']

	useEffect(()=>{
		addPositionToPositionList(fen)
		window.addEventListener('resize', ()=>{
			adjustBoardLength()
		})
	}, [])

	useEffect(()=>{
		fetchDB(fen, database)
		.then(json=>{
			jsonParserRef.current.setJson(json)
			makeEnginMoveIfNeeded(json)	
		})	
	}, [lastFen])

	useEffect(()=>{
		const currentPosition=positionList.getCurrentPosition()
		if (currentPosition){
			setFen(currentPosition)
		}
  }, [positionList])

	/**
	 * 
	 * @returns the smaller of the dimensions of the parent element
	 * or -1 if the parentRef is null
	 */
	function getSmallerParentDimension(){
		if (props.parentRef.current){
			const parentWidth=props.parentRef.current.clientWidth
			const parentHeight=props.parentRef.current.clientHeight
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
	 * causes the engine to make a move if it's its turn to move
	 * and updates related variables
	 * @param json 
	 */
	function makeEnginMoveIfNeeded(json:any){
		const turnColor=fen.split(' ')[1]=='w' ? 'white' : 'black'
		if (turnColor!=colorPlayerCanControl){
			
			const move:string=engineRef.current.getRandomResponseFromDB(json)
			if (move){
				updateChessObject(move)
				addPositionToPositionList(chess.fen())
			}
	
		}		
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
	 * helper function that determines if a move is a promotion
	 */
	function isMovePromotion(fen:string, orig: cg.Key, dest: cg.Key):boolean{
		const tempChess=new Chess(fen)
		const move=tempChess.move({from:orig, to:dest, promotion:'q'}, undefined)

		return move.flags.includes('p')
	}

	/**
	 * 
	 * @param square 
	 * @returns the file number on which the given square is found
	 * (starting from 0 at the a-file to 7 at the h-file) 
	 */
	function getFile(square:cg.Key):number{
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

	/**
	 * @returns the rank number on which the given square is found 
	 * @param square 
	 */
	function getRank(square:cg.Key):number{
		return parseInt(square.charAt(1)) 
	}

	/**
	 * updates the chess object with the given move
	 * @param move 
	 */
	function updateChessObject(move:string){
		chess.move(move)
		const newFen=chess.fen()
		engineRef.current.setFen(newFen)
		setFen(newFen)
	}

	/**
	 * default function that runs after a move is made by the player
	 */
	function afterHumanPlayerMove(orig: cg.Key, dest: cg.Key, metadata: 
		cg.MoveMetadata){
		
		if (isMovePromotion(fen, orig, dest)){
			setPromotionFile(getFile(orig))
			setIsPromotionVisible(true)
		}
		else{
			applyHumanMove(orig+dest)
		}
	}

	/**
	 * function called when the promotion popup is visible and the user made 
	 * their choice of promotion
	 * @param symbol the choice the user made as promotion.
	 * q : Queen
	 * r : Rook
	 * b : Bishop
	 * n : Knight
	 */
	function promotionChoiceFunction(symbol: 'q'|'r'|'b'|'n'){
		setIsPromotionVisible(false)
		const move:string|null=getPromotionMove(chess, promotionFile, symbol)
		if (move){
			applyHumanMove(move)
		}
		
	}

	/**
	 * called after every human move
	 * @param move 
	 */
	function applyHumanMove(move:string){
		if (!positionList.isPointingToLastPosition()){
			positionList.spliceTree()
		}
		updateChessObject(move)
		const newFen=chess.fen()
		addPositionToPositionList(newFen)
		setLastFen(newFen)
		setFen(newFen)
	}

	/**
	 * given a pieceColor and pieceSquare, returns the promotion Square associated
	 * with it
	 * @param pieceColor 
	 * @param pieceSquare 
	 */
	function getPromotionSquare(pieceColor: Color, pieceSquare:Square):Square{
		const factor:number=pieceColor=='w' ? 1 : -1
		const rank=getRank(pieceSquare)
		const newRank=rank+factor

		if (!(newRank==1 || newRank==8)){
			throw new Error(`given square ${pieceSquare} is invalid`)
		}

		const promotionSquare=pieceSquare.charAt(0)+newRank.toString() as Square
		return promotionSquare
		
	}

	/**
	 * returns the move that corresponds the promotion that just happened, 
	 * or null if no valid promotion was found
	 * @param promotionFile 
	 * @param color 
	 */
	function getPromotionMove(chess:Chess, promotionFile:number,
		promotionSymbol: 'q'|'r'|'b'|'n'):string|null{

		const promotionColor:Color=chess.fen().split(' ')[1] as Color

		for (let row:number=0; row<8; row++){
			for (let col:number=0; col<8; col++){
				const piece=chess.board()[row][col]
				if (piece!=null){
					const pieceSquare=piece.square
					const pieceColor=piece.color
					const pieceType=piece.type
					const pieceFile=getFile(pieceSquare)

					if (pieceColor==promotionColor && pieceType=='p' && 
					pieceFile==promotionFile){
						if ((pieceColor=='w' && getRank(pieceSquare)==7) || 
						(pieceColor=='b' && getRank(pieceSquare)==2)){
							const promotionSquare=getPromotionSquare(pieceColor, pieceSquare)
							return pieceSquare+promotionSquare+promotionSymbol
						}
						
					}
				}
			}
		}

		return null;

	}

	/**
	 * 
	 * @returns the config object required by Chessground
	 */
	function getConfig():Config{

		const turnColor:cg.Color = fen.split(' ')[1]=='w'
		? 'white' : 'black'
		
		return {
			fen: fen,
			orientation: orientation,
			coordinates:false,
			turnColor: turnColor,
			lastMove: [],
			movable: {
				free: false,
				dests: getDests(chess, colorPlayerCanControl),
				events: {
					after: afterHumanPlayerMove
				}
			}
		}
	}

	useEffect(()=>{
		if (isPromotionVisible){
			setBoardOpacity(DISABLED_BOARD_OPACITY)
		}
		else{
			setBoardOpacity(1)
		}
	}, [isPromotionVisible])

	useEffect(()=>{
		adjustBoardLength()
	}, [props.parentRef])

	return (

		<ResponsiveSquare child={
			<div style={{position: 'relative', width: '100%', height: '100%'}}>	
				<div style={{position: 'relative', width: '100%', height: '100%', 
				opacity:boardOpacity}}>
					<Chessground config={getConfig()} contained={true}/>
				</div>
				
				<PromotionDialog isVisible={isPromotionVisible}
				top='0px' file={promotionFile} 
				promotionChoiceFunction={promotionChoiceFunction}/>
			</div>
		} 
		squareLength={length}/>
	)

}
