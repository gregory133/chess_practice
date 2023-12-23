import { Chess } from 'chess.js'
import LinkedList, {Node} from 'dbly-linked-list'

export default class PositionList{

  private positionList:LinkedList
  private currentIndex:number

  public constructor(){
    this.positionList=new LinkedList()
    this.currentIndex=-1
  }

  /**
   * insert given position at the end of the list and sets the current index to
   * the last element
   * @param position 
   */
  public addPosition(position:string){
    this.positionList.insert(position)
    this.currentIndex=this.positionList.getSize()-1
  }

  /**
   * return the current position
   */
  public getCurrentPosition():string|null{
    const node=this.positionList.findAt(this.currentIndex)
    if (node){
      return node.data as string
    }
    
    return null
  }

  /**
   * navigates the current index forward, if there is a next element
   */
  public navigateForward(){
    if (this.currentIndex+1<this.positionList.getSize()){
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
    else{
      // console.log('not updating');
    }
  }

  /**
   * clears the positionList object
   */
  public clear(){
    this.positionList.clear()
    this.currentIndex=-1
  }

  public toString():string{
    const chess=new Chess();
    let positionsRawArray=this.positionList.toArray().map(posNode=>{
      const fen=posNode.toString()
      chess.load(fen)
      return chess.ascii()
    })
   
    return positionsRawArray.join('\n\n')+'\n index:'+this.currentIndex;
  }

  public clone():PositionList{
    let clone=new PositionList()
    this.positionList.forEach((positionNode:any)=>{
      clone.addPosition(positionNode.data)
    })
    clone.currentIndex=this.currentIndex
    return clone
  }

  public size():number{
    return this.positionList.size
  }

  public isPointingToLastPosition():boolean{
    return this.currentIndex==this.positionList.getSize()-1;
  }

  /**
   * deletes the positions from this.currentIndex (exclusive) to the end of the positionList
   */
  public spliceTree(){
    const size=this.positionList.size
    for (let i=0; i<(size-1-this.currentIndex); i++){
      this.positionList.remove()
    }
  }

}