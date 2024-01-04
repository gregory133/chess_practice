import { Set } from "typescript-collections";

export function cloneSet<T>(set:Set<T>):Set<T>{
    let newSet:Set<T>=new Set()
    set.forEach((element:T)=>{
        newSet.add(element)
    })
    return newSet
}