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
    const timeControls: Set<TimeControl>=new Set();{
        timeControls.add('rapid')
        timeControls.add('classical')
        timeControls.add('correspondence')
    }
    const ratings: Set<Rating>=new Set();{
        ratings.add(1800)
        ratings.add(2000)
        ratings.add(2200)
        ratings.add(2500)
    }

    return {
        since: YEAR_LOWER_BOUND, 
        until: YEAR_UPPER_BOUND, 
        setSince: (since:number)=>set((state:DatabaseSettingsStore)=>{
            return {since:since}
        }),
        setUntil: (until: number)=>set((state:DatabaseSettingsStore)=>{
            return {until:until}
        }),

        timeControls: timeControls, 
        ratings:ratings, 
        toggleTimeControl:(timeControl:TimeControl)=>set((state:DatabaseSettingsStore)=>{
            let newTimeControls=cloneSet(state.timeControls)
            state.timeControls.contains(timeControl) 
                ? newTimeControls.remove(timeControl) 
                : newTimeControls.add(timeControl)

            return {timeControls: newTimeControls}
        }),
        toggleRating:(rating: Rating)=>set((state:DatabaseSettingsStore)=>{
            let newRatings=cloneSet(state.ratings)

            state.ratings.contains(rating) 
                ? newRatings.remove(rating) 
                : newRatings.add(rating)

            return {ratings: newRatings}
        })
    }
}


export interface DatabaseSettingsStore{
    since: number,
    until: number
    setSince:(since:number)=>void
    setUntil:(until:number)=>void

    timeControls: Set<TimeControl>,
    ratings: Set<Rating>
    toggleTimeControl: (timeControl:TimeControl)=>void
    toggleRating: (rating:Rating)=>void
}

export const useDatabaseSettingsStore=create<DatabaseSettingsStore>()(set=>(
    initializeState(set)
))