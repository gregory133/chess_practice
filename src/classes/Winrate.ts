export default class Winrate{

  public black;
  public white;
  public draw;

	/**
	 * constructs a Winrate object given the black and white winrates.
	 * black+white must be <= 1. Draw winrate will be inferred. Throws an
	 * error if arguments are invalid
	 * @param black black winrate expressed as a decimal 0 <= x <= 1
	 * @param white white winrate expressed as a decimal 0 <= x <= 1
	 */
	public constructor(black:number, white:number){

		const draw= 1 - (black+white)
		this.black=black;
		this.white=white;
		this.draw=draw;

	}
  
	public toString():string{
		
		return 'W:' + Math.round(this.white * 100) / 100 + ' / D:' + Math.round(this.draw * 100) / 100 
		+ ' / ' + 'B:' + Math.round(this.black * 100) / 100
	}

  	/**
	 * 
	 * @returns true if the winrate is in a valid state, false otherwise
	 */
	public isValid(){

		if (isNaN(this.black) || isNaN(this.white) || isNaN(this.draw)) return false

		const list=[this.black, this.white, this.draw]
		let returnValue:boolean=true
		list.forEach(number=>{
		if (number<0 || number>1){
			returnValue = false
		}
		})

		return returnValue
	}

  

}