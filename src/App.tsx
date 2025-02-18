import Board from './components/Board/Board'
import Sidebar from './components/Sidebar/Sidebar'
import styles from './App.module.scss'

export default function App() {

	function onFenChange(fen:string){
		
	}

	return (

		<div className={styles.main}>
			<Board onFenChange={onFenChange}/>
			<Sidebar/>
		</div>
	)
}
