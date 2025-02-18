import React, { useEffect } from 'react'
import Board from './Board/Board'

export default function App() {

	function onFenChange(fen:string){

	}

	return (

		<div>
			<Board onFenChange={onFenChange}/>
		</div>
	)
}
