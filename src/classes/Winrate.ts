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

    const draw=1-(black+white)
    this.black=black;
    this.white=white;
    this.draw=draw;

    if (!this.constructorArgumentsValid(black, draw, white)){
      console.log('throw');
      throw new Error('winrate object arguments invalid')
    }
  }

  private constructorArgumentsValid(black:number, draw:number, white:number)
  :boolean{
    const list=[black, white, draw]
    let returnValue:boolean=true
    list.forEach(number=>{
      if (number<0 || number>1){
        returnValue = false
      }
    })

    return returnValue
  }

}