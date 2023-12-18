import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Basket } from 'src/app/models/basket';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  private basketSource = new BehaviorSubject<any>(null);
  basket$ = this.basketSource.asObservable();

  public cartItems: any = [];
  public itemsList = new BehaviorSubject<any>([]);

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  getItems() {
    let cartItems = JSON.parse(localStorage.getItem('cart')!);
    this.cartItems = cartItems;
    if (this.cartItems === null) this.cartItems = [];
    this.itemsList.next(this.cartItems);
    return this.itemsList.asObservable();
  }
  setItems(item: any) {
    this.cartItems.push(...item);
    this.itemsList.next(item);
  }
  addToCart(item: any) {
    if (this.isInCart(item.id)) {
      this.toastr.error('ቀደም ብሎ ዕቃው ወደ ቅርጫት ለግብይት ዝግጁ ሆኗል', 'ቀደም ብሎ ተመዝግቧል');

      alert('ቀደም ብሎ ዕቃው ወደ ቅርጫት ገብቷል፡፡ ');
    } else {
      this.cartItems.push(item);
      this.itemsList.next(this.cartItems);
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
      this.getTotalPrice();
    }
  }

  unloadToStore(item: any) {
    if (this.isInCart(item.id)) {
      this.toastr.error('ቀደም ብሎ ዕቃው ወደ ቅርጫት ለግብይት ዝግጁ ሆኗል', 'ቀደም ብሎ ተመዝግቧል');

      alert('ቀደም ብሎ ዕቃው ወደ ቅርጫት ገብቷል፡፡ ');
    } else {
      this.cartItems.push(item);
      this.itemsList.next(this.cartItems);
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
      this.getTotalPrice();
    }
  }

  //check an item found in the cart
  isInCart(id: number) {
    return !!this.cartItems.find((item: any) => item.id == id);
  }

  //get total price
  getTotalPrice() {
    let grandTotal = 0;
    this.cartItems.map((m: any) => {
      grandTotal += m.price;
    });
  }

  //sale the items in the cart for some selected customer
  saleCartItems(data: any) {
    return this.http.post(environment.baseURL + '/sale/loadItems', data);
  }

  saleItemToCustomer(loadId, data) {
    return this.http.post(
      environment.baseURL + '/sale/loadItems/' + loadId, data
    );
  }

  removeCartItem(item: any) {
    this.cartItems.map((m: any, index: any) => {
      if (item.id === m.id) {
        this.cartItems.splice(index, 1);
      }
    });
    this.itemsList.next(this.cartItems);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.toastr.success('ዕቃው ከዘንቢሉ ተቀንሷል፡፡', 'ዕቃ መቀነስ');
  }

  clearCart() {
    this.cartItems = [];
    localStorage.removeItem('cart');
    this.itemsList.next(this.cartItems);
  }
  getBasket(id: number) {
    return this.http.get(environment.baseURL + '/basket?id=' + id).pipe(
      map((basket: any) => {
        this.basketSource.next(basket);
      })
    );
  }
  setBasket(basket: any) {
    return this.http.post(environment.baseURL + '/basket', basket).subscribe(
      (res: any) => {
        this.basketSource.next(res);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getCurrentBasketValue() {
    return this.basketSource.value;
  }

  addItemToBasket(item: any, price: number) {
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items.push(item);
    basket.items.push(price);
    this.setBasket(basket);
  }

  private createBasket(): any {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

   //change items quantity to be putrchased
   updateSalesQuantity (item:any,qty:number) {
    let index = this.cartItems.indexOf(item);
    item.salesQty = qty;
    this.cartItems[index] = item;

    this.itemsList.next(this.cartItems);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));

  }

  updateUnitTariffQuantity (item:any,qty:number) {
    let index = this.cartItems.indexOf(item);
    item.pay_quantity = qty;
    this.cartItems[index] = item;

    this.itemsList.next(this.cartItems);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  updateUnitTariffPrice (item:any,price:number) {
    let index = this.cartItems.indexOf(item);
    item.unitTariff = price;
    this.cartItems[index] = item;

    this.itemsList.next(this.cartItems);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }


  updateDriverLoan (item:any,val:number) {
    let index = this.cartItems.indexOf(item);
    item.driverLoan = val;
    this.cartItems[index] = item;

    this.itemsList.next(this.cartItems);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  updateOtherExpense (item:any,val:number) {
    let index = this.cartItems.indexOf(item);
    item.otherExpense = val;
    this.cartItems[index] = item;

    this.itemsList.next(this.cartItems);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  updateSalesPrice(item:any,val:number) {
    let index = this.cartItems.indexOf(item);
    item.salesPrice = val;
    this.cartItems[index] = item;

    this.itemsList.next(this.cartItems);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }


}
