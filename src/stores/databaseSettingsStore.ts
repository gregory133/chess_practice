import {create} from 'zustand';
import { TimeControl } from '../types/TimeControl';
import { Rating } from '../types/Rating';
import { Set } from 'typescript-collections';
import { YEAR_LOWER_BOUND, YEAR_UPPER_BOUND } from '../constants/MastersDatabase';

interface MastersSettings{
    since: number,
    until: number
}

interface LichessSettings{
    timeControls: Set<TimeControl>,
    averageRatings: Set<Rating>
}

/**
 * 
 * @returns an object storing the required initial state of the store
 */
function initializeState():DatabaseSettingsStore{

    const timeControls: Set<TimeControl>=new Set();{
        timeControls.add('rapid')
        timeControls.add('classical')
        timeControls.add('correspondence')
    }
    const averageRatings: Set<Rating>=new Set();{
        averageRatings.add(1800)
        averageRatings.add(2000)
        averageRatings.add(2200)
        averageRatings.add(2500)
    }

    return {
        mastersSettings:{since: YEAR_LOWER_BOUND, until: YEAR_UPPER_BOUND},
        setMastersSettings: ()=>{},
        lichessSettings: {timeControls: timeControls, averageRatings:averageRatings},
        setLichessSettings: ()=>{}
    }
}


export interface DatabaseSettingsStore{
    mastersSettings: MastersSettings
    setMastersSettings: (mastersSettings:MastersSettings)=>void

    lichessSettings: LichessSettings
    setLichessSettings: (lichessSettings:LichessSettings)=>void
    
}

export const useDatabaseSettingsStore=create<DatabaseSettingsStore>()(set=>(
    initializeState()
))