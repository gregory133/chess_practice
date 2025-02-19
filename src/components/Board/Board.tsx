import Chessground from '@react-chess/chessground'

import "./styles/chessground.base.scss";
import "./styles/chessground.brown.scss";
import "./styles/chessground.cburnett.scss";
import { Config } from 'chessground/config';
import { Chess, Square } from 'chess.js'

import styles from './styles/Board.module.scss'
import * as cg from 'chessground/types.js';
import { use, useContext, useEffect, useState } from 'react';
import DatabaseAPI from '../../api/DatabaseAPI';
import { BoardContext } from '../../App';


export default function Board() {

	const SQUARES:string[]=['a8' , 'b8' , 'c8' , 'd8' , 'e8' , 'f8' , 'g8' , 'h8' , 
		'a7' , 'b7' , 'c7' , 'd7' , 'e7' , 'f7' , 'g7' , 'h7' , 'a6' , 'b6' , 'c6' , 'd6' , 
		'e6' , 'f6' , 'g6' , 'h6' , 'a5' , 'b5' , 'c5' , 'd5' , 'e5' , 'f5' , 'g5' , 'h5' , 
		'a4' , 'b4' , 'c4' , 'd4' , 'e4' , 'f4' , 'g4' , 'h4' , 'a3' , 'b3' , 'c3' , 'd3' , 
		'e3' , 'f3' , 'g3' , 'h3' , 'a2' , 'b2' , 'c2' , 'd2' , 'e2' , 'f2' , 'g2' , 'h2' , 
		'a1' , 'b1' , 'c1' , 'd1' , 'e1' , 'f1' , 'g1' , 'h1']

	const [colorCanMove, setColorCanMove] = useState<'white' | 'black' | undefined>('white')
	const {fen, addMove, cursor, positionList, lastMove, setLastMove} = useContext(BoardContext)!

	useEffect(()=>{

		const colorToMove : 'white' | 'black'= fen.split(' ')[1] == 'w' ? 'white' : 'black'
		if (colorToMove != colorCanMove){
			makeEngineMove()
		}

	}, [fen])

	/**called to make the engine move when it is its turn */
	function makeEngineMove(){

		DatabaseAPI.getInstance()?.getMastersDatabase(fen)
		.then(move=>{
			
			if (move == ''){
				console.log('database out of moves')
			}
			else if (cursor == positionList.length - 1){

				let chess = new Chess(fen)
				chess.move(move)
				const verboseMove = chess.history({verbose: true})[0]
				addMove(verboseMove.from + verboseMove.to)
				setLastMove([verboseMove.from, verboseMove.to])
			}
			
		})
	}

	/**called after the user makes a move on the board */
	function afterMove(orig: cg.Key, dest: cg.Key, metadata: cg.MoveMetadata){
		updateFen(orig, dest)
		setLastMove([orig, dest])
	}

	/**updates the fen state variable given the origin and destination squares*/
	function updateFen(orig: cg.Key, dest: cg.Key){
		addMove(orig + dest)
	}

	/**returns a dests object which maps all legal moves possible on the current
	 * position
	 */
	function getDests() : cg.Dests{

		let chess = new Chess(fen)
		let dests:Map<cg.Key, cg.Key[]>=new Map();

		const colorToMove : 'white' | 'black' = fen.split(' ')[1] == 'w' ? 'white' : 'black'

		if (colorToMove != colorCanMove){
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

	/**returns the configs of the board */
	function getConfig() : Config{

		return {
			fen: fen,
			coordinates: false,
			movable: {
				events: {
					after: afterMove
				},
				free: false,
				color: 'both',
				dests: getDests(),
				showDests: true
			},
			lastMove: lastMove
		}

	}

	return (

		<div className={styles.main}>

			<Chessground config={getConfig()} contained={true}/>

		</div>
		
	)

}
