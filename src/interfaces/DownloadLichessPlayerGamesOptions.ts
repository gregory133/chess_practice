import { TimeControl } from "../types/TimeControl"

export default interface DownloadLichessPlayerGamesOptions{

    username: string
    fen : string
    color : 'white'|'black'
}