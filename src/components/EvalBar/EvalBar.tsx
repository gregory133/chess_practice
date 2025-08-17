import React, { useEffect, useState } from 'react'
import styles from './evalBar.module.scss'

interface Props{
	evaluation: string
}

export default function EvalBar(props:Props) {

	console.log(props.evaluation)

	const BLACK = '#3d3d3d'
	const WHITE = '#bdbdbd'

	const [blackStyle, setBlackStyle] = useState({flex:0.1, backgroundColor: BLACK})
	const [whiteStyle, setWhiteStyle] = useState({flex:0.9, backgroundColor: WHITE})

	useEffect(()=>{
		
		processEvaluation(props.evaluation)

	}, [props.evaluation])

	function processEvaluation(evaluation:string){

		let isMate = false
		let evaluationNumber
		if (evaluation.includes('#')){
			isMate = true
			evaluationNumber = evaluation.includes('-') ? -Infinity : Infinity
		}
		else{
			evaluationNumber = parseInt(evaluation)
		}

		const factor = 0.2
		const evalFlexFunction = (x:number) => Math.exp(-factor * x)

		if (!isMate){
			const flexRatio = evalFlexFunction(evaluationNumber)
			setBlackStyle({flex:flexRatio, backgroundColor: BLACK})
			setWhiteStyle({flex:1, backgroundColor: WHITE})
		}
		else{
			const matingColor = evaluationNumber > 0 ? WHITE : BLACK
			console.log(evaluation)
			setBlackStyle({flex:1, backgroundColor: matingColor})
			setWhiteStyle({flex:1, backgroundColor: matingColor})
		}

		

	}

	return (
		<div className={styles.main}>
			<div className={styles.black} style={blackStyle}/>
			<div className={styles.midBar}/>
			<div className={styles.white} style={whiteStyle}/>
		</div>
	)
}
