import Winrate from "../classes/Winrate"

export default class DatabaseAPI{

    private static instance : DatabaseAPI | null = null
    private database : 'masters' | 'lichess' = 'masters'

    private constructor(){}

    public static getInstance() : DatabaseAPI{

        if (this.instance == null){
            this.instance = new DatabaseAPI()
        }

        return this.instance

    }


    /**given a list of objects containing moves and their playrate data, pick a random move 
     * according to its playrate (more play = higher chance of getting picked) and returns 
     * the move in SAN notation
     */
    private pickWeightedMove(moves : any[]) : string{

        const total = moves.reduce((accumulator:any, currentValue:any)=>{
            return accumulator + currentValue.white + currentValue.black + currentValue.draws
        }, 0)
        
        const playrates = moves.map((move:any)=>{
            return {move: move.san, playrate:(move.white + move.black + move.draws) / total}
        })

        for (let i = 1; i < playrates.length; i++){
            playrates[i].playrate += playrates[i - 1].playrate
        }

        const randomNum = Math.random()

        for (let i = 0; i < playrates.length; i++){
            if (randomNum < playrates[i].playrate){
                return playrates[i].move
            }
        }

        return ''


    }


    /**returns a promise that resolves into the SAN of a move returned by Lichess' Masters Database
     * for the given fen
     */
    public getRandomResponse(fen:string, database : 'lichess'|'masters', options? : any) : Promise<string>{

        return new Promise((resolve, reject)=>{

            const url = new URL(`https://explorer.lichess.ovh/${database}`)
            url.searchParams.append('fen', fen)

            fetch(url)
            .then(response => response.json())
            .then(data=>{
                let openingName = null
                if (data.opening){
                    openingName = data.opening.name
                }

                resolve(this.pickWeightedMove(data.moves),)
            })

            
            

        })

    }

    /**given the fen of a position and a particular database to be queried, returns useful info
     * from that database
     */
    public getPositionInfo(fen:string, database:'masters'|'lichess') : Promise<
    {
        openingName:string|null,
        numGamesInDatabase: number,
        numPossibleMoves:number,
        winrate: Winrate
    }>{

        return new Promise((resolve, reject)=>{

            const url = new URL(`https://explorer.lichess.ovh/${database}`)
            url.searchParams.append('fen', fen)

            fetch(url)
            .then(response=>response.json())
            .then(data=>{
                
                let openingName = null
                if (data.opening){
                    openingName = data.opening.name
                }

                resolve({
                    openingName: openingName,
                    numGamesInDatabase: data.white + data.black + data.draws,
                    numPossibleMoves: data.moves.length,
                    winrate: new Winrate(data.black/(data.white + data.black + data.draws), 
                        data.white/(data.white + data.black + data.draws))
                })

            })

        })

    }

    /**
     * Similar to the getPositionInfo function, but returns the raw json object
     * @param fen 
     * @param database 
     */
    public getPositionInfoVerbose(fen:string, database: 'masters'|'lichess') : Promise<any>{

        return new Promise((resolve, reject)=>{

            const url = new URL(`https://explorer.lichess.ovh/${database}`)
            url.searchParams.append('fen', fen)

            fetch(url)
            .then(response=>response.json())
            .then(data=>{

               resolve(data)
               
            })

        })

    }

}