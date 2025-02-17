export default class DatabaseAPI{

    private static instance : DatabaseAPI | null = null

    private constructor(){}

    public static getInstance() : DatabaseAPI{

        if (this.instance == null){
            this.instance = new DatabaseAPI()
        }

        return this.instance

    }

    private pickRandomMove(responseObject : any) : string{
        
        return responseObject.moves[Math.floor(Math.random() * responseObject.moves.length)].san
    }

    /**returns a promise that resolves into the SAN of a move returned by Lichess' Masters Database
     * for the given fen
     */
    public getMastersDatabase(fen:string) : Promise<string>{

        return new Promise((resolve, reject)=>{

            const url = new URL('https://explorer.lichess.ovh/masters')
            url.searchParams.append('fen', fen)

            fetch(url)
            .then(response => response.json())
            .then(data=>{
                resolve(this.pickRandomMove(data))
            })

        })

    }

}