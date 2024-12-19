import { TimeControl } from "../types/TimeControl"

export default interface DownloadLichessPlayerGamesOptions{

    maxNumber? : number
    timeControls?: TimeControl[]
    vsPlayer?: string
    color : 'white'|'black'
    
}