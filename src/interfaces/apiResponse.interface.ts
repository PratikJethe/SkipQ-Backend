// export interface IApiResponse {
//   resId: string;
//   data: object;
// }


export interface IApiResponse {

    resId?:string,
    status:number,
    error?:boolean,
    errorMsg?:string
    data?:object

}
