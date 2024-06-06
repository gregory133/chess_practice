import { Chess } from 'chess.js'
import LinkedList, {Node, NodeData} from 'dbly-linked-list'
import Position from './Position'
import { INITIAL_FEN } from './ChessUtil'

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
  public addPosition(position:Position){
    this.positionList.insert(position)
    this.currentIndex=this.positionList.getSize()-1

    
  }

  public addPositionByUCI(moveUCI:string){
    let lastPosition=this.positionList.getTailNode()?.data as Position
    if (!lastPosition){
      this.addPosition(new Position(INITIAL_FEN, ''))
    }
    lastPosition=this.positionList.getTailNode()?.data as Position
    let chess=new Chess(lastPosition.fen)
      chess.move(moveUCI)
      let newPosition=new Position(
        chess.fen(), chess.history({verbose:true})[chess.history().length-1].lan)
      this.addPosition(newPosition)
  }

  /**
   * return the current position
   */
  public getCurrentPosition():Position|null{
    const node=this.positionList.findAt(this.currentIndex)
    if (node){
      return node.data as Position
    }
    
    return null
  }

  public getLastPosition():Position|null{
    const numElements=this.size()
    if (numElements>0){
      const node=this.positionList.findAt(numElements-1)
      if (node){
        return node.data as Position
      }
      else{
        return null
      }
    }
    else{
      return null
    }
    
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
  }

  /**
   * clears the positionList object
   */
  public clear(){
    this.positionList.clear()
    this.currentIndex=-1
  }

  public toString():string{

    let returnString=''
    let index=0
    let currentText=''
    this.positionList.forEach((node:any)=>{
      let position=node.data
      if (index==this.currentIndex){
        currentText='(current) '
      }
      returnString += currentText+ 'index ' + index + ' : ' + position.fen + " -> " + position.lastLAN 
      + "\n" + '-----------------' + '\n' 
      index++
      currentText=''
    })
    return returnString
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