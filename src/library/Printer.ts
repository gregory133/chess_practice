import { Set } from "typescript-collections"

export function printSet<T>(set:Set<T>){
    let arr:T[]=[]
    set.forEach((element:T)=>{
        arr.push(element)
    })
    console.log(arr)
}