import Board from './components/Board/Board'
import Sidebar from './components/Sidebar/Sidebar'
import styles from './App.module.scss'
import { createContext, useState } from 'react'

export default function App() {

	const [fen, setFen] = useState<string>('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')

	return (

		<div className={styles.main}>
			<Board fen={fen} setFen={setFen}/>
			<Sidebar/>
		</div>
		
	)
}
