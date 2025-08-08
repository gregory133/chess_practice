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
import ChessUtil from './classes/ChessUtil';

/**interface representing the variables associated with the chess board*/
interface BoardContextInterface{
	fen:string
	addMove: (lan:string)=>void
	cursor: number
	positionList: string[]
	reset: (colorCanMove:'white'|'black', initialPosition?:string)=>void
	isEditModeActive: boolean
	setIsEditModeActive: (value:boolean)=>void
	removeAfter: (index:number)=>void
	colorCanMove : 'white'|'black'
}

/**interface representing the variables associated with the user settings*/
interface SettingsContextInterface{
	database : 'masters' | 'lichess',
	setDatabase  : (val : 'masters' | 'lichess') => void
}

export const BoardContext = createContext<null | BoardContextInterface>(null)
export const SettingsContext = createContext<null | SettingsContextInterface>(null)

export default function App() {

	const DEFAULT_DATABASE = 'masters'
	

	const {addMove, positionList, cursor, navigateBack, navigateForward, reset, removeAfter,
		colorCanMove
	}
	= usePositionList(ChessUtil.STARTING_POS)

	const [database, setDatabase] = useState<'masters' | 'lichess'>(DEFAULT_DATABASE)
	const [isEditModeActive, setIsEditModeActive] = useState(false)
	
	useEffect(()=>{
		addPositionListKeyListeners()
		
	}, [])

	

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

		<SettingsContext.Provider value={{database: database, setDatabase: setDatabase}}>
		<BoardContext.Provider value={{fen:positionList[cursor], addMove, cursor, positionList
			,reset, isEditModeActive, setIsEditModeActive, removeAfter, colorCanMove
		}}>
			<div className={styles.main}>
				<Navbar/>
				<div className={styles.content}>
					<div className={styles.leftSection}>
						<MovesBar fen={positionList[cursor]}/>
						<Stockfish fen={positionList[cursor]}/>
					</div>
					<Board/>
					<Sidebar/>
				</div>
			</div>
		</BoardContext.Provider>
		</SettingsContext.Provider>
		
		
	)
}
