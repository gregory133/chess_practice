import Chessground from '@react-chess/chessground'
import React, {useEffect, useState, useMemo, useRef} from 'react'
import { Chess, Color, Move, Square } from 'chess.js'
import { Config } from 'chessground/config';
import * as cg from 'chessground/types.js';
import PromotionDialog from './PromotionDialog/PromotionDialog';
import "../../styles/chessground.base.scss";
import "../../styles/chessground.brown.scss";
import "../../styles/chessground.cburnett.scss";
import ResponsiveSquare from '../ResponsiveSquare/ResponsiveSquare';
import { useChessStore } from '../../stores/chessStore';
import Engine from '../../classes/Engine';
import { Database, fetchDB, getPlayrateFromDB } from '../../api/DBApi';
import LichessDatabaseJSONParser from '../../api/LichessDatabaseJSONParser';
import {DrawShape} from 'chessground/draw'
import { useDatabaseSettingsStore } from '../../stores/databaseSettingsStore';
import Position from '../../classes/Position';
import DatabaseSettings from '../../interfaces/DatabaseSettings';
import MastersDatabaseSettings from '../../classes/DatabaseSettings/MastersDatabaseSettings';
import LichessDatabaseSettings from '../../classes/DatabaseSettings/LichessDatabaseSettings';
import PlayerDatabaseSettings from '../../classes/DatabaseSettings/PlayerDatabaseSettings';
import styles from './Board.module.scss'
import Playrate from '../../classes/Playrate';

export default function Board() {

	const startingFen = useChessStore(state=>state.startingFen)
	const fen=useChessStore(state=>state.currentFen)
	const lastFen=useChessStore(state=>state.lastFen)
	const setFen=useChessStore(state=>state.setCurrentFen)
	const setLastFen=useChessStore(state=>state.setLastFen)
	const setPlayrate = useChessStore(state=>state.setPlayrate)
	const orientation=useChessStore(state=>state.orientation)
	const colorPlayerCanControl=useChessStore(state=>state.colorPlayerCanControl)
	const isStockfishArrowActive=useChessStore(state=>state.isStockfishArrowActive)
	const evaluation=useChessStore(state=>state.evaluation)

	const mastersOptions = useDatabaseSettingsStore(state=>state.mastersOptions)
	const lichessOptions = useDatabaseSettingsStore(state=>state.lichessOptions)
	const playerOptions = useDatabaseSettingsStore(state=>state.playerOptions)

	const engineRef=useRef(new Engine(fen))
	const jsonParserRef=useRef(new LichessDatabaseJSONParser(null))
	
	const [forceDisplayHighlight, setForceDisplayHighlight]=useState(false)
	const [isPromotionVisible, setIsPromotionVisible]=useState(false)
	const [length, setLength]=useState(0)
	const [boardOpacity, setBoardOpacity]=useState<number>(1)
	const [promotionFile, setPromotionFile]=useState<number>(0)
	const [stockfishArrowSuggestion, setStockfishArrowSuggestion]
	=useState<{from:cg.Key, to:cg.Key}|null>(null)

	
	const resetDetector = useChessStore(state=>state.resetDetector)
	const lastFromToSquares = useChessStore(state=>state.lastFromToSquares)
	const positionList=useChessStore(state=>state.positionList)
	const database:Database=useChessStore(state=>state.selectedDatabase)
	const blueArrow=useChessStore(state=>state.blueArrow)

	const addPositionToPositionListByFEN=useChessStore(state=>state.
		addPositionToPositionListByFEN)
	const addPositionToPositionListByUCI=useChessStore(state=>state.
		addPositionToPositionListByUCI)
	const setLastFromToSquares = useChessStore(state=>state.setLastFromToSquares)
	
	const chess=new Chess(fen)
	const engineMoveDelay = 500 //in milliseconds
		
	const DISABLED_BOARD_OPACITY=0.5
	const SQUARES:string[]=['a8' , 'b8' , 'c8' , 'd8' , 'e8' , 'f8' , 'g8' , 'h8' , 
	'a7' , 'b7' , 'c7' , 'd7' , 'e7' , 'f7' , 'g7' , 'h7' , 'a6' , 'b6' , 'c6' , 'd6' , 
	'e6' , 'f6' , 'g6' , 'h6' , 'a5' , 'b5' , 'c5' , 'd5' , 'e5' , 'f5' , 'g5' , 'h5' , 
	'a4' , 'b4' , 'c4' , 'd4' , 'e4' , 'f4' , 'g4' , 'h4' , 'a3' , 'b3' , 'c3' , 'd3' , 
	'e3' , 'f3' , 'g3' , 'h3' , 'a2' , 'b2' , 'c2' , 'd2' , 'e2' , 'f2' , 'g2' , 'h2' , 
	'a1' , 'b1' , 'c1' , 'd1' , 'e1' , 'f1' , 'g1' , 'h1']

	useEffect(()=>{
		setLastFromToSquares([])
	}, [resetDetector])

	useEffect(()=>{
		if (startingFen == lastFen){
			setLastFromToSquares([])
		}

		const databaseSettings = getDatabaseSettings(lastFen)
		if (databaseSettings){
			// console.log(databaseSettings.getDatabaseName(), databaseSettings.getURL())
			fetchDB(databaseSettings)
			.then(json=>{
				jsonParserRef.current.setJson(json)
				makeEngineMoveIfNeeded(json)	
			})	
		}
	}, [lastFen])

	useEffect(()=>{

		const currentPosition=positionList.getCurrentPosition()
		const lastPosition=positionList.getLastPosition()
		updateLastMoveHighlightedSquares(currentPosition)

		const currentFen=currentPosition?.fen
		const lastFen=lastPosition?.fen

		updatePlayrateMoves()

		if (currentFen!=lastFen){
			const lastLAN=currentPosition?.lastLAN
			let lastFromTo:cg.Key[]=[]
			if (lastLAN!=''){
				const from=lastLAN?.substring(0, 2) as cg.Key
				const to=lastLAN?.substring(2, 4) as cg.Key
				lastFromTo=[from, to]
				
			}
	
			setLastFromToSquares(lastFromTo)
			setForceDisplayHighlight(true)

		}
		else{
			setForceDisplayHighlight(false)
		}

	}, [fen])

	useEffect(()=>{
		if (positionList.size()==0){
			setLastFromToSquares([])
		}
		const currentPosition=positionList.getCurrentPosition()
		if (currentPosition){
			setFen(currentPosition.fen)
		}
  }, [positionList])

	useEffect(()=>{
		if (!isStockfishArrowActive){
			setStockfishArrowSuggestion(null)
		}
		else{
			if (evaluation){
				const from=evaluation.bestMove.substring(0, 2) as cg.Key
				const to=evaluation.bestMove.substring(2, evaluation.bestMove.length) as cg.Key
				setStockfishArrowSuggestion({from:from, to:to})
			}
			else{
				setStockfishArrowSuggestion(null)
			}
		}
	}, [isStockfishArrowActive])


	useEffect(()=>{
		if (isPromotionVisible){
			setBoardOpacity(DISABLED_BOARD_OPACITY)
		}
		else{
			setBoardOpacity(1)
		}
	}, [isPromotionVisible])

	/**called to update the playrate in the MovesBar component */
	function updatePlayrateMoves(){
		
		const color = fen.split(' ')[1] == 'w' ? 'white' : 'black'
		const databaseSettings = getDatabaseSettings(fen)
		if (databaseSettings){
			fetchDB(databaseSettings)
			.then(json=>{
				// console.log(json)
				const playrate = getPlayrateFromDB(database, color, json)
				// console.log(playrate)
		
				
				setPlayrate(playrate)
			})
		}
		
	}

	/**returns the DatabaseSettingsObject corresponding to the current database */
	function getDatabaseSettings(fen:string):DatabaseSettings|null{
		let databaseSettings : DatabaseSettings|null = null
		if (database=='masters'){
			databaseSettings = new MastersDatabaseSettings(fen, mastersOptions.since, 
			mastersOptions.until)
		}
		else if (database == 'lichess'){
			databaseSettings = new LichessDatabaseSettings(fen, lichessOptions.timeControls, 
			lichessOptions.ratings)
		}
		else if (database == 'player'){
			// databaseSettings = new PlayerDatabaseSettings(playerOptions.username, playerOptions.color, fen)
			const playerColor = fen.split(' ')[1]=='w' ? 'white' : 'black'
			databaseSettings = new PlayerDatabaseSettings('greg133', playerColor, fen)
			// console.log(databaseSettings)
		}
		return databaseSettings
	}

	/**called to update the last move highlighted squares on the board */
	function updateLastMoveHighlightedSquares(currentPosition:Position|null){
		if (currentPosition){
			const lastLAN=currentPosition.lastLAN
			if (lastLAN!=''){
				const fromSquare=lastLAN.substring(0, 2) as cg.Key
				const toSquare=lastLAN.substring(2, 4) as cg.Key
				setLastFromToSquares([fromSquare,toSquare])
			}
		}
	}

	/**
	 * causes the engine to make a move if it's its turn to move
	 * and updates related variables
	 * @param json 
	 */
	function makeEngineMoveIfNeeded(json:any){
		const turnColor=fen.split(' ')[1]=='w' ? 'white' : 'black'
		// console.log(json)
		if (turnColor!=colorPlayerCanControl){
			
			const move:string=engineRef.current.getRandomResponseFromDB(json)
			if (move){
				setTimeout(()=>{
					applyMove(move)
				}, engineMoveDelay)
				
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
		// console.log(chess.fen())
		chess.move(move)
		const lastLAN = chess.history({verbose:true})[chess.history().length-1].lan
		// console.log(lastLAN);
		const newFen=chess.fen()
		addPositionToPositionListByUCI(lastLAN)

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
		applyMove(move)
		const newFen=chess.fen()
		setLastFen(newFen)
		setFen(newFen)
	}

	/**called when any move needs to be made, human or engine */
	function applyMove(move:string){
		// console.log(move)
		updateChessObject(move)
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
	 * @returns The autoshape object which draws arrows on the board
	 */
	function getAutoShapes():DrawShape[]{
		let autoShapes : DrawShape[] = []
		if (lastFromToSquares.length!=0){
			autoShapes.push(
				{
					orig: lastFromToSquares[0],
					dest: lastFromToSquares[1],
					brush: 'yellow',
				}
			)
		}
		if (isStockfishArrowActive && blueArrow){
			autoShapes.push(
				{
					orig: blueArrow.from,
					dest: blueArrow.to,
					brush: 'blue',
				}
			)
		}

		return autoShapes
	}

	/**
	 * 
	 * @returns the config object required by Chessground
	 */
	function getConfig():Config{

		const turnColor:cg.Color = fen.split(' ')[1]=='w'
		? 'white' : 'black'
		
		let config:Config={
			fen: fen,
				orientation: orientation,
				coordinates:false,
				turnColor: turnColor,
				animation: {
					enabled: false
				},
				lastMove: lastFromToSquares,
				highlight:{
					lastMove: false,
					check:true,
				},
				movable: {
					free: false,
					dests: getDests(chess, colorPlayerCanControl),
					events: {
						after: afterHumanPlayerMove
					}
				},
				drawable: {
					autoShapes: getAutoShapes()
				}
		}
		return config	
	}
	
	return (

		<div className={styles.main}>	
			<div className={styles.board} style={{opacity:boardOpacity}}>
				<Chessground config={getConfig()} contained={true}/>
			</div>
			
			<PromotionDialog isVisible={isPromotionVisible}
			top='0px' file={promotionFile} 
			promotionChoiceFunction={promotionChoiceFunction}/>
		</div>

	)

}
