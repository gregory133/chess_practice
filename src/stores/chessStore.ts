import {create} from 'zustand';
import Winrate from '../classes/Winrate';
import { Database } from '../api/DBApi';
import PositionList from '../classes/PositionList';
import * as cg from 'chessground/types.js';
import { Eval, Evaluation } from '../components/Stockfish/StockfishComponent';
import Position from '../classes/Position';
import Playrate from '../classes/Playrate';

export const INITIAL_FEN='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

export interface ChessStoreState{
  resetDetector:boolean
  startingFen:string
  currentFen: string
  lastFen: string
  lastFromToSquares : cg.Key[]
  numGamesInDB: number|null
  numMovesInDB: number|null
  winrate: Winrate|null
  openingName: string
  orientation: 'black'|'white'
  colorPlayerCanControl: 'black'|'white'|null
  selectedColor: 'white'|'random'|'black'
  selectedDatabase: Database
  positionList: PositionList
  evaluation:Evaluation|null
  isStockfishArrowActive: boolean
  playrate: Playrate
  blueArrow: {from:cg.Key, to:cg.Key}|null

  setStartingFen:(newFen:string)=>void
  setCurrentFen:(newFen:string)=>void
  setLastFen: (newFen:string)=>void
  setLastFromToSquares: (newVal:cg.Key[])=>void
  setNumGamesInDB: (num:number|null)=>void
  setNumMovesInDB: (num:number|null)=>void
  setWinrate: (newVal: Winrate|null)=>void
  setOpeningName: (newVal: string)=>void
  setOrientation: (newVal: 'black'|'white')=>void
  setColorPlayerCanControl: (newVal: 'black'|'white'|null)=>void
  setSelectedColor: (newVal:'white'|'random'|'black')=>void
  setSelectedDatabase: (newVal:Database)=>void
  setEvaluation: (evaluation:Evaluation|null)=>void
  setPlayrate: (playrate:Playrate)=>void

  addPositionToPositionListByFEN: (fen:string, lastLAN:string)=>void
  addPositionToPositionListByUCI: (moveUCI:string)=>void
  clearPositionList: ()=>void
  navigatePositionListForward: ()=>void
  navigatePositionListBackward: ()=>void

  setIsStockfishArrowActive: (value:boolean)=>void
  setBlueArrow: (value:{from:cg.Key, to:cg.Key}|null)=>void

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
    resetDetector: true,
    startingFen: INITIAL_FEN,
    currentFen: INITIAL_FEN,
    lastFen: INITIAL_FEN,
    lastFromToSquares: [],
    numGamesInDB: null,
    numMovesInDB: null,
    winrate: null,
    openingName: '',
    colorPlayerCanControl: randomColor,
    orientation: randomColor,
    selectedColor: 'random',
    selectedDatabase: 'player',
    positionList: new PositionList(),
    evaluation: null,
    blueArrow:null,
    playrate: new Playrate(),
    isStockfishArrowActive: false,

    setStartingFen: (newFen:string)=>set((state:ChessStoreState)=>{
      return {startingFen: newFen}
    }),
    setCurrentFen: (newFen:string)=>set((state:ChessStoreState)=>{
      return {currentFen :newFen}
    }),
    setLastFen: (newFen:string)=>set((state:ChessStoreState)=>{
      return {lastFen: newFen}
    }),
    setLastFromToSquares: (newVal:cg.Key[])=>set((state:ChessStoreState)=>{
      return {lastFromToSquares: newVal}
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
    setSelectedColor: (newVal:'white'|'random'|'black')=>
    set((state:ChessStoreState)=>{
      return {selectedColor: newVal}
    }),
    setEvaluation: (newEval:Evaluation|null)=>set((state:ChessStoreState)=>{
      return {evaluation: newEval}
    }),
    setSelectedDatabase: (newVal: Database)=>
    set((state: ChessStoreState)=>{
      return {selectedDatabase: newVal}
    }),
    addPositionToPositionListByFEN: (fen, lastLAN)=>
    set((state:ChessStoreState)=>{
      let clone=state.positionList.clone()
      clone.addPosition(new Position(fen, lastLAN))
      return {positionList:clone}
    }),
    addPositionToPositionListByUCI: (moveUCI:string)=>
    set((state:ChessStoreState)=>{
      // console.log('adding position to positionList', moveUCI)
      
      let clone=state.positionList.clone()
      // console.log('current fen before adding: ', clone.getCurrentPosition())
      clone.addPositionByUCI(moveUCI)
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
    setIsStockfishArrowActive: (value:boolean)=>set((state:ChessStoreState)=>{
      return {isStockfishArrowActive: value}
    }),
    setBlueArrow: (value: {from:cg.Key, to:cg.Key}|null)=>set((state:ChessStoreState)=>{
      return {blueArrow: value}
    }),
    setPlayrate: (value:Playrate)=>set((state:ChessStoreState)=>{
      return {playrate: value}
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
      if (state.selectedColor=='random'){
        playerColor=getRandomColor()
      }
      else{
        playerColor=state.selectedColor
      }
      const positionList = new PositionList()
      
      if (startingFen){
        positionList.setFirstPosition(startingFen)
        positionList.addPosition(new Position(startingFen, ''))
      }

      return {
        resetDetector: !state.resetDetector,
        positionList: positionList,
        currentFen: newFen,
        lastFen: newFen,
        lastFromToSquares: [],
        numGamesInDB: null, 
        numMovesInDB: null,
        winrate: null,
        openingName: '',
        colorPlayerCanControl: playerColor,
        orientation: playerColor,
        isStockfishArrowActive: false,
        evaluation: null,
        blueArrow: null
      }
    })
  }
}

export const useChessStore=create<ChessStoreState>()(set=>(
  initialize(set)
))