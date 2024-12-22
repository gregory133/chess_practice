import { Dictionary } from "typescript-collections";
import { Database } from "../api/DBApi";

export default interface DatabaseSettings{

  getDatabaseName: ()=>Database
  getURL:()=>URL

}