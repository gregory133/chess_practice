import Board from './components/Board/Board'
import Sidebar from './components/Sidebar/Sidebar'
import styles from './App.module.scss'
import { createContext, useState } from 'react'

interface BoardContextInterface{
	setFen : (fen:string)=>void
}

export const BoardContext = createContext<null | BoardContextInterface>(null)

export default function App() {

	const [fen, setFen] = useState<string>('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')

	return (

		<BoardContext.Provider value={{setFen}}>
			<div className={styles.main}>
				<Board fen={fen}/>
				<Sidebar/>
			</div>
		</BoardContext.Provider>
		
		
	)
}
