import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  //session Storage means close tab and data gone
  // storage: Storage = sessionStorage;

  //Local storage means store in brower memory adn after closing tab or browser
  storage: Storage = localStorage;



  constructor() { 

    //read data from storage
    //@ts-ignore
    let data = JSON.parse(this.storage.getItem('cartItems'));

    console.log("\n\n########################DATA START############################");

    console.log(this.storage.getItem('cartItems'));

    console.log("######################DATA END##############################\n\n");

    if(data != null){
      this.cartItems = data;

      //compute totals based on the data that is read from storage
      this.computeCartTotals();
    }

  }

  public addToCart(theCartItem: CartItem){

    //check if we already have the item in our cart
    let alreadyExistsIncart: boolean = false;
    let existingCartItem: CartItem = undefined!;

    if(this.cartItems.length > 0){
      
      //find the item in the cart based on item id
      for(let tempCartItem of this.cartItems){
        if(tempCartItem.id==theCartItem.id){
          existingCartItem = tempCartItem;
          break;
        }
      }

      //this is a replacement of above loop
      //existingCartItem = this.cartItems.find(tempCartItems => tempCartItems.id == theCartItem.id);
  
      //check if we found it
      alreadyExistsIncart = (existingCartItem != undefined);
    }

    if(alreadyExistsIncart){
      //increment the quantity
      existingCartItem.quantity++;
    }
    else{
      this.cartItems.push(theCartItem);
    }

    //compute cart total price and total quantity
    this.computeCartTotals();
    
  }

  public computeCartTotals(){
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }


    //publish this new values .... all subscribers will receive this new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);


    //log cart data
    this.logCartData(totalPriceValue,totalQuantityValue);

    //persist the cart data
    this.persistCartItems();

  }
  
  public logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the Cart')
    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`)
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('------------')
  }

  public decrementQuantity(theCartItem: CartItem){
    
    theCartItem.quantity--;
    if(theCartItem.quantity==0){
      this.remove(theCartItem);
    }
    else{
      this.computeCartTotals();
    }
  }

  public remove(theCartItem: CartItem){
    
    //get index of item in the array
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);

    //if found,remove the item from the array at the given index
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex,1);
      
      this.computeCartTotals();
    }
  }

  public persistCartItems(){
    console.log("\n\n----------------START PERSIST--------------------------")
    this.storage.setItem('cartItems',JSON.stringify(this.cartItems));
    console.log(JSON.stringify(this.cartItems))
    console.log("----------------END PERSIST--------------------------\n\n")
  }
  
}
