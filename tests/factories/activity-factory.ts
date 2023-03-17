import faker from "@faker-js/faker";

export function  createDate(){
    const date = faker.date.soon(0)
    return date;
}
export function createDateBetween(date1:Date,date2:Date){
    const date = faker.date.between(date1,date2);
    console.log(date);
    return date;
}
export function createDateBefore(date1:Date){
    const date = faker.date.recent(0,date1)
    return date;
}
export function createDateAfter(date1:Date){
    const date = faker.date.soon(0,date1)
    return date;
}