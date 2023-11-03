export interface LocationConfiguration {
    id:string;
    name: string;
    longitude:number;
    latitude:number;
    GoodSwellHeight:number;
    NormalSwellHeight:number;
    GoodSwellPeriod:number;
    NormalSwellPeriod:number;
    GoodTide:number;
    NormalTide:number;
    GoodWindDirection:string;
    NormalWindDirection:string;
    GoodWindSpeed:number;
    NormalWindSpeed:number;
}