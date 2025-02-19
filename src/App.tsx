import Board from './components/Board/Board'
import Sidebar from './components/Sidebar/Sidebar'
import styles from './App.module.scss'
import { createContext, useState } from 'react'
import * as cg from 'chessground/types.js';

interface BoardContextInterface{
	fen:string
	setFen : (fen:string) => void
	lastMove : cg.Key[]
	setLastMove : (lastMove : cg.Key[]) => void
}

export const BoardContext = createContext<null | BoardContextInterface>(null)

export default function App() {

	const [lastMove, setLastMove] = useState<cg.Key[]>([])
	const [fen, setFen] = useState<string>('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')

	return (

		<BoardContext.Provider value={{fen, setFen, lastMove, setLastMove}}>
			<div className={styles.main}>
				<Board/>
				<Sidebar/>
			</div>
		</BoardContext.Provider>
		
		
	)
}
