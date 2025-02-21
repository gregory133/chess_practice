import Board from './components/Board/Board'
import Sidebar from './components/Sidebar/Sidebar'
import styles from './App.module.scss'
import { createContext, useEffect, useRef, useState } from 'react'
import * as cg from 'chessground/types.js';
import usePositionList from './hooks/usePositionList';
import Navbar from './components/Navbar/Navbar';

interface BoardContextInterface{
	fen:string
	addMove: (lan:string)=>void
	cursor: number
	positionList: string[]
}

export const BoardContext = createContext<null | BoardContextInterface>(null)

export default function App() {

	const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
	const CARO = 'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2'

	const {addMove, positionList, cursor, navigateBack, navigateForward} = usePositionList(INITIAL_FEN)
	
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
	

	// useEffect(()=>{
	// 	console.log(cursor)
	// }, [cursor])

	

	return (

		<BoardContext.Provider value={{fen:positionList[cursor], addMove, cursor, positionList}}>
			<div className={styles.main}>
				<Navbar/>
				<div className={styles.content}>
					<Board/>
					<Sidebar/>
				</div>
			</div>
		</BoardContext.Provider>
		
		
	)
}
