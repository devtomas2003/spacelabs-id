export function simplifyName(nameComplete: string){
    const nameSplt = nameComplete.split(" ");
    return {
        firstLast: nameSplt[0] + " " + nameSplt[nameSplt.length-1],
        firstName: nameSplt[0]
    };
}