import { Item } from "./item";
import { v4 as uuidv4 } from 'uuid';

export interface IBasket{
    id:number;
    items:Item[];
}

export class Basket{
    id:string = uuidv4();
    item:number=0;
    quantity:number=0;
    unitPrice:number=0;


}

