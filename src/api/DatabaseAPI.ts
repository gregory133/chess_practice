export default class DatabaseAPI{

    private static instance : DatabaseAPI | null = null

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
    public getMastersDatabase(fen:string, options? : any) : Promise<string>{

        return new Promise((resolve, reject)=>{

            const url = new URL('https://explorer.lichess.ovh/masters')
            url.searchParams.append('fen', fen)

            fetch(url)
            .then(response => response.json())
            .then(data=>{
                resolve(this.pickWeightedMove(data.moves))
            })

        })

    }

}