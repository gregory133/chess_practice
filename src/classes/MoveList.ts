import LinkedList, {Node} from 'dbly-linked-list'

export default class MoveList{

  private moveList:LinkedList
  private currentIndex:number

  public constructor(){
    this.moveList=new LinkedList()
    this.currentIndex=-1
  }

  /**
   * insert given move at the end of the list and sets the current index to
   * the last element
   * @param moveUCI 
   */
  public addMove(moveUCI:string){
    this.moveList.insert(moveUCI)
    this.currentIndex=this.moveList.getSize()-1
  }

  /**
   * navigates the current index forward, if there is a next element
   */
  public navigateForward(){
    if (this.currentIndex+1<this.moveList.getSize()){
      this.currentIndex++;
    }
  }

  /**
   * navigates the current index backward, if there is a next element
   */
  public navigateBackward(){
    if (this.currentIndex>0){
      this.currentIndex--;
    }
  }

  /**
   * clears the moveList object
   */
  public clear(){
    this.moveList.clear()
    this.currentIndex=-1
  }

  public toString():string{
    let movesRawArray=this.moveList.toArray()
    movesRawArray[this.currentIndex]=`[${movesRawArray[this.currentIndex]}]`
    return movesRawArray.join(',')
  }

  public clone():MoveList{
    let clone=new MoveList()
    this.moveList.forEach((move:any)=>{
      clone.addMove(move.data)
    })
    return clone
  }


}