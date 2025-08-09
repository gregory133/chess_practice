import React, { useEffect, useState } from 'react'
import styles from './evalBar.module.scss'

interface Props{
	evaluation: string
}

export default function EvalBar(props:Props) {

	const [blackStyle, setBlackStyle] = useState({flex:0.1})
	const [whiteStyle, setWhiteStyle] = useState({flex:0.9})

	useEffect(()=>{
		
		processEvaluation(props.evaluation)

	}, [props.evaluation])

	function processEvaluation(evaluation:string){

		let evaluationNumber
		if (evaluation.includes('M')){
			evaluationNumber = evaluation.includes('-') ? -Infinity : Infinity
		}
		else{
			evaluationNumber = parseInt(evaluation)
		}

		const factor = 0.2
		const evalFlexFunction = (x:number) => 1/(1 + Math.pow(Math.E, -1 * factor*x))

		const flexRatio = evalFlexFunction(evaluationNumber)
		setBlackStyle({flex:1 - flexRatio})
		setWhiteStyle({flex:flexRatio})

		console.log(flexRatio)


	}

	return (
		<div className={styles.main}>
			<div className={styles.black} style={blackStyle}/>
			<div className={styles.midBar}/>
			<div className={styles.white} style={whiteStyle}/>
		</div>
	)
}
