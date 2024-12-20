import {create} from 'zustand';
import { TimeControl } from '../types/TimeControl';
import { Rating } from '../types/Rating';
import { Set } from 'typescript-collections';
import { YEAR_LOWER_BOUND, YEAR_UPPER_BOUND } from '../constants/MastersDatabase';
import { cloneSet } from '../library/Cloner';
import { printSet } from '../library/Printer';

/**
 * 
 * @returns an object storing the required initial state of the store
 */
function initializeState(set:any):DatabaseSettingsStore{
    
    return {
        mastersOptions : {since: YEAR_LOWER_BOUND, until: YEAR_UPPER_BOUND},
        lichessOptions : {timeControls: ['blitz', 'rapid', 'classical'], ratings: [1800, 2000, 2200, 2500]},
        playerOptions : {username: '', color: 'black'}, 

        setMastersOptions: (newOptions:{since:number, until: number})=>set((state:DatabaseSettingsStore)=>{
            return {mastersOptions: newOptions}
        }),
        setLichessOptions: (newOptions:{timeControls: TimeControl[], ratings: Rating[]})=>
        set((state:DatabaseSettingsStore)=>{
            return {lichessOptions: newOptions}
        }),
        setPlayerOptions: (newOptions:{username: string, maxGames? : number, vsPlayer? : string, 
            color : 'white'|'black', timeControl? : TimeControl[]
        })=>set((state:DatabaseSettingsStore)=>{
            return {playerOptions: newOptions}
        }),
    }

}

export interface DatabaseSettingsStore{
    mastersOptions : {since:number, until: number}
    lichessOptions : {timeControls: TimeControl[], ratings: Rating[]},
    playerOptions : {username: string, maxGames? : number, vsPlayer? : string, color : 'white'|'black', 
        timeControl? : TimeControl[]
    }
    setMastersOptions : (newOptions : {since:number, until: number})=>void
    setLichessOptions : (newOptions : {timeControls: TimeControl[], ratings: Rating[]})=>void
    setPlayerOptions : (newOptions : {username: string, maxGames? : number, vsPlayer? : string, 
        color : 'white'|'black', timeControl : TimeControl[]})=>void
}

export const useDatabaseSettingsStore=create<DatabaseSettingsStore>()(set=>(
    initializeState(set)
))