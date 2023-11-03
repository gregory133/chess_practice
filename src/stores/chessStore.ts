import {create} from 'zustand';
import Winrate from '../classes/Winrate';

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

  setStartingFen:(newFen:string)=>void
  setCurrentFen:(newFen:string)=>void
  setNumGamesInDB: (num:number|null)=>void
  setNumMovesInDB: (num:number|null)=>void
  setWinrate: (newVal: Winrate|null)=>void
  setOpeningName: (newVal: string)=>void
  setOrientation: (newVal: 'black'|'white')=>void
  setColorPlayerCanControl: (newVal: 'black'|'white'|null)=>void

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
    setColorPlayerCanControl: (newVal: 'black'|'white'|null)=>set((state:ChessStoreState)=>{
      return {colorPlayerCanControl: newVal}
    }),
    reset: ()=>set((state:ChessStoreState)=>{
      const randomColor=getRandomColor()
      return {
        startingFen: INITIAL_FEN,
        currentFen: INITIAL_FEN,
        numGamesInDB: null,
        numMovesInDB: null,
        winrate: null,
        openingName: '',
        colorPlayerCanControl: randomColor,
        orientation: randomColor
      }
    })
  }
}

export const useChessStore=create<ChessStoreState>()(set=>(
  initialize(set)
))