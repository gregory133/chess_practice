import {create} from 'zustand';
import Winrate from '../classes/Winrate';
import { Database } from '../api/DBApi';
import PositionList from '../classes/PositionList';
import { Eval } from '../classes/Stockfish';


export const INITIAL_FEN='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

export interface ChessStoreState{
  startingFen:string
  currentFen: string
  numGamesInDB: number|null
  numMovesInDB: number|null
  winrate: Winrate|null
  openingName: string
  orientation: 'black'|'white'
  colorPlayerCanControl: 'black'|'white'|null
  selectedColor: 'white'|'any'|'black'
  selectedDatabase: Database
  positionList: PositionList
  evaluation:Eval

  setStartingFen:(newFen:string)=>void
  setCurrentFen:(newFen:string)=>void
  setNumGamesInDB: (num:number|null)=>void
  setNumMovesInDB: (num:number|null)=>void
  setWinrate: (newVal: Winrate|null)=>void
  setOpeningName: (newVal: string)=>void
  setOrientation: (newVal: 'black'|'white')=>void
  setColorPlayerCanControl: (newVal: 'black'|'white'|null)=>void
  setSelectedColor: (newVal:'white'|'any'|'black')=>void
  setSelectedDatabase: (newVal:Database)=>void
  setEvaluation: (newVal:Eval)=>void

  addPositionToPositionList: (moveUCI:string)=>void
  clearPositionList: ()=>void
  navigatePositionListForward: ()=>void
  navigatePositionListBackward: ()=>void

  reset:()=>void
}

/**
 * 
 * @returns 'white' or 'black' randomly
 */
function getRandomColor(){
  if (Math.random()>0.5){
    return 'white'
  }
  return 'black'
}

/**
 * changes the fullmove number of the given fen every so slightly so as
 * to return a different fen bearing the same position
 */
function varyFen(fen:string):string{
      
  const fenParts:string[]=fen.split(' ')
  let fullMoveNumber=parseInt(fenParts[5])
  fenParts.pop()

  if (fullMoveNumber>1){
    fullMoveNumber--;
  }
  else{
    fullMoveNumber++;
  }

  const patchedFen=fenParts.join(' ')+' '+fullMoveNumber
  // console.log(patchedFen);
  return patchedFen

}

/**
 * initializes the state
 * @param set 
 * @returns 
 */
function initialize(set:any):ChessStoreState{

  const randomColor=getRandomColor()

  return {
    startingFen: INITIAL_FEN,
    currentFen: INITIAL_FEN,
    numGamesInDB: null,
    numMovesInDB: null,
    winrate: null,
    openingName: '',
    colorPlayerCanControl: randomColor,
    orientation: randomColor,
    selectedColor: 'any',
    selectedDatabase: 'masters',
    positionList: new PositionList(),
    evaluation: {value: 0, type: 'cp'} as Eval,

    setStartingFen: (newFen:string)=>set((state:ChessStoreState)=>{
      return {startingFen: newFen}
    }),
    setCurrentFen: (newFen:string)=>set((state:ChessStoreState)=>{
      return {currentFen :newFen}
    }),
    setNumGamesInDB: (num:number|null)=>set((state:ChessStoreState)=>{
      return {numGamesInDB:num}
    }),
    setNumMovesInDB: (num:number|null)=>set((state:ChessStoreState)=>{
      return {numMovesInDB:num}
    }),
    setWinrate: (newVal: Winrate|null)=>set((state:ChessStoreState)=>{
      return {winrate: newVal}
    }),
    setOpeningName: (newVal: string)=>set((state:ChessStoreState)=>{
      return {openingName: newVal}
    }),
    setOrientation: (newVal: 'black'|'white')=>set((state:ChessStoreState)=>{
      return {orientation: newVal}
    }),
    setColorPlayerCanControl: (newVal: 'black'|'white'|null)=>
    set((state:ChessStoreState)=>{
      return {colorPlayerCanControl: newVal}
    }),
    setSelectedColor: (newVal:'white'|'any'|'black')=>
    set((state:ChessStoreState)=>{
      return {selectedColor: newVal}
    }),
    setEvaluation: (newVal:Eval)=>set((state:ChessStoreState)=>{
      return {evaluation: newVal}
    }),
    setSelectedDatabase: (newVal: Database)=>
    set((state: ChessStoreState)=>{
      return {selectedDatabase: newVal}
    }),
    addPositionToPositionList: (position:string)=>
    set((state:ChessStoreState)=>{
      let clone=state.positionList.clone()
      clone.addPosition(position)
      return {positionList: clone}
    }),
    clearPositionList: ()=>set((state:ChessStoreState)=>{
      let clone=state.positionList.clone()
      clone.clear()
      return {positionList: clone}
    }),
    navigatePositionListForward: ()=>set((state:ChessStoreState)=>{
      let clone=state.positionList.clone()
      clone.navigateForward()
      return {positionList: clone}
    }),
    navigatePositionListBackward: ()=>set((state:ChessStoreState)=>{
      let clone=state.positionList.clone()
      clone.navigateBackward()
      return {positionList: clone}
    }),
    reset: ()=>set((state:ChessStoreState)=>{
   
      const oldFen=state.currentFen
      const startingFen=state.startingFen
      let newFen:string
      if (oldFen==startingFen){
        newFen=varyFen(startingFen)
      }
      else{
        newFen=startingFen
      }

      let playerColor
      if (state.selectedColor=='any'){
        playerColor=getRandomColor()
      }
      else{
        playerColor=state.selectedColor
      }

      return {
        currentFen: newFen,
        numGamesInDB: null,
        numMovesInDB: null,
        winrate: null,
        openingName: '',
        colorPlayerCanControl: playerColor,
        orientation: playerColor
      }
    })
  }
}

export const useChessStore=create<ChessStoreState>()(set=>(
  initialize(set)
))