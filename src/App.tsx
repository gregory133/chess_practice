import Board from './components/Board/Board'
import Sidebar from './components/Sidebar/Sidebar'
import styles from './App.module.scss'
import { createContext, useEffect, useRef, useState } from 'react'
import * as cg from 'chessground/types.js';
import usePositionList from './hooks/usePositionList';
import Navbar from './components/Navbar/Navbar';
import MovesBar from './components/MovesBar/MovesBar';
import Playrate from './classes/Playrate';
import Winrate from './classes/Winrate';
import DatabaseAPI from './api/DatabaseAPI';
import Stockfish from './components/Stockfish/Stockfish';

interface BoardContextInterface{
	fen:string
	addMove: (lan:string)=>void
	cursor: number
	positionList: string[]
	reset: (initialPosition?:string)=>void
	isEditModeActive: boolean
	setIsEditModeActive: (value:boolean)=>void
}

export const BoardContext = createContext<null | BoardContextInterface>(null)

export default function App() {

	const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
	const CARO = 'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2'

	const {addMove, positionList, cursor, navigateBack, navigateForward, reset, removeAfter}
	= usePositionList(INITIAL_FEN)
	const [isEditModeActive, setIsEditModeActive] = useState(false)
	
	useEffect(()=>{
		addPositionListKeyListeners()

		document.addEventListener('keydown', (event)=>{
			if (event.shiftKey){
				removeAfter(3)
			}
		})
		
	}, [])

	useEffect(()=>{
		console.log(positionList)
	}, [positionList])

	function addPositionListKeyListeners(){

		document.addEventListener('keydown', (event)=>{
			if (event.key == 'ArrowLeft'){
				navigateBack()
			}
			else if (event.key == 'ArrowRight'){
				navigateForward()
			}
		})
	}

	return (

		<BoardContext.Provider value={{fen:positionList[cursor], addMove, cursor, positionList
			,reset, isEditModeActive, setIsEditModeActive
		}}>
			<div className={styles.main}>
				<Navbar/>
				<div className={styles.content}>
					<div className={styles.leftSection}>
						<MovesBar fen={positionList[cursor]}/>
						{/* <Stockfish fen={positionList[cursor]}/> */}
					</div>
					<Board/>
					<Sidebar/>
				</div>
			</div>
		</BoardContext.Provider>
		
		
	)
}
