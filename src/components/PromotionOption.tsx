import React, {useState} from 'react'
import styles from '../styles/PromotionOption.module.scss'

interface Props{
	promotionChoiceFunction:(symbol:'q'|'r'|'b'|'n')=>void
	symbol:'q'|'r'|'n'|'b'
	image:string
}

export default function PromotionOption({promotionChoiceFunction,
symbol, image}:Props) {

	const GREY_RIM='rgb(175,175,175)'
	const GREY_CENTRE='rgb(144,144,143)'
	
	const ORANGE_RIM='rgb(189, 143, 115)'
	const ORANGE_CENTRE='rgb(206, 99, 48)'
	
	const CIRCLE='50%'
	const ZOOMED_SCALE='100%'
	const UNZOOMED_SCALE='80%'
	const SQUARE='0%'

	const [bgColorRim, setBgColorRim]=useState(GREY_RIM)
	const [bgColorCentre, setBgColorCentre]=useState(GREY_CENTRE)
	const [roundedness, setRoundedness]=useState(CIRCLE)
	const [imageScale, setImageScale]=useState(UNZOOMED_SCALE)

	function onMouseEnter(){
		setBgColorRim(ORANGE_RIM)
		setBgColorCentre(ORANGE_CENTRE)
		setRoundedness(SQUARE)
		setImageScale(ZOOMED_SCALE)
	}

	function onMouseLeave(){
		setBgColorRim(GREY_RIM)
		setBgColorCentre(GREY_CENTRE)
		setRoundedness(CIRCLE)
		setImageScale(UNZOOMED_SCALE)
	}
	return (
		<button onMouseEnter={onMouseEnter} 
		onMouseLeave={onMouseLeave}
		
		style={{
			backgroundImage:`radial-gradient(circle, ${bgColorRim}, 
			${bgColorCentre})`, 
			borderRadius:roundedness,
			// backgroundSize:'50%'
		}} 
		onClick={()=>{promotionChoiceFunction(symbol)}}>
			<img src={image} width={imageScale}/>

		</button>
	)
}
