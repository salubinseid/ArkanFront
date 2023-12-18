// export default interface DataDescription{
//   label?:string,
//   data? : string[],
//   backgroundColor?:string
// }

export default interface MyChartData{
  labels: string[],
  datasets: {
    label:string,
    data : string[],
    backgroundColor:string
  }[]
}
