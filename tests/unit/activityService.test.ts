import activitiesService, { VerifyHour } from "@/services/activities-service";
import { createDate,createDateAfter,createDateBefore,createDateBetween } from "../factories/activity-factory";

describe("activity unit test suit ",()=>{

    it("should return true if activity hours are equal",()=>{
        const start = createDate();
        const end = createDate();
        const selecStart = start;
        const selecEnd = end ;
        
        const res = VerifyHour(start,end,selecStart,selecEnd) ;
        expect(res).toBe(true);
    })
    it("should return true if  selected start  hours are between start and end",()=>{
        const start = createDate();
        const end = createDateAfter(start);
        const selecStart = createDateBetween(start,end);
        const selecEnd = createDateAfter(selecStart);
        
        const res = VerifyHour(start,end,selecStart,selecEnd) ;
        expect(res).toBe(true);
    })
    it("should return true if  selected end  hours are between start and end",()=>{
        const start = createDate();
        const end = createDateAfter(start);
        const selecEnd = createDateBetween(start,end);
        const selecStart =  createDateBefore(selecEnd);
        
        const res = VerifyHour(start,end,selecStart,selecEnd) ;
        expect(res).toBe(true);
    })
    it("should return false if  activity hours are diferent",()=>{
        const start = createDate();
        const end = createDateAfter(start);
        const selecStart =  createDateAfter(end);
        const selecEnd = createDateAfter(selecStart);
        
        const res = VerifyHour(start,end,selecStart,selecEnd) ;
        expect(res).toBe(false);
    })
})
