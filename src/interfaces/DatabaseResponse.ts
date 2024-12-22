import { Dictionary } from "typescript-collections";
import { Database } from "../api/DBApi";
import Winrate from "../classes/Winrate";

/**An interface encapsulating the JSON response from a cloud database.
 * Contains the data required by the program to display
 */
export default interface DatabaseResponse{

    database: Database
    winrate : Winrate
    numGamesInDB : number
    movesWinrate : Dictionary<string, Winrate>

}