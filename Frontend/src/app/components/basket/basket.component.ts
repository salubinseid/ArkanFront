import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/app/Services/customer.service';
import { StorexService } from 'src/app/Services/storex.service';
import { BasketService } from './basket.service';
import { MoneyTypeService } from 'src/app/Services/money-type.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css'],
})
export class BasketComponent implements OnInit {
  selectedFile!: any;
  imgUrl: any;
  public error = '';
  public fileData: any;
  carts: any = [];
  customers: any;
  accounts: any;
  remainAmount = 0;
  grandTotal = 0;
  totalItems = 0;
  moneyTypes: any;

  cashoutForm!: FormGroup;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  public filterData: string = '';
  public displayedColumns = [
    'itemName',
    'salesQty',
    'salesPrice',
    'pay_quantity',
    'unitTariff',
    'driverLoan',
    'otherExpense',
    'total',
    'driverPhone',
    'actions',
  ];
  public dataSource = new MatTableDataSource<any>();
  isClicked: boolean = false;
  selected: any;
  csqEditMode: boolean = false;
  cutqEditMode: boolean = false;
  cdlEditMode: boolean = false;
  coeEditMode: boolean = false;
  cutpEditMode: boolean = false;
  cspEditMode: boolean = false;
  isAbroad: boolean = false;
  country = 'ኢትዮጵያ';

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  public doFilter() {
    this.dataSource.filter = this.filterData.trim().toLocaleLowerCase();
  }

  constructor(
    private basketService: BasketService,
    private custService: CustomerService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private storex: StorexService,
    private moneyTypeService: MoneyTypeService
  ) {}

  ngOnInit(): void {
    this.getAllBasketItems();
    this.getMoneyType();

    this.custService.getCustomersName().subscribe((res) => {
      this.customers = res;
    });

    this.cashoutRegForm();
  }

  getMoneyType = () => {
    this.moneyTypeService.getByName().subscribe(
      (res) => {
        this.moneyTypes = res;
      },
      (error) => console.log(error)
    );
  };

  cashoutRegForm() {
    this.cashoutForm = this.fb.group({
      customer_id: ['', Validators.required],
      paidAmount: [''],
      moneyType: [1],
      exchangeRate: ['1'],
      image: [''],
      remainAmount: [this.remainAmount],
      remark: [''],
      items: [this.basketService.cartItems, Validators.required],
      createdBy: [this.storex.getLoginUser()],
    });
  }

  getAllBasketItems() {
    this.basketService.getItems().subscribe(
      (res) => {
        this.carts = res;
      },
      (err) => console.log(err)
    );

    this.totalItems = this.carts.length;
    this.dataSource = this.carts;
    this.grandTotal = 0;
    this.basketService.cartItems.map((item: any) => {
      const saleQty = item.salesQty ? item.salesQty : 0;
      const salePrice = item.salesPrice ? item.salesPrice : 0;
      const unitTariff = item.unitTariff ? item.unitTariff : 0;
      const pay_quantity = item.pay_quantity ? item.pay_quantity : 0;
      const driverLoan = item.driverLoan ? item.driverLoan : 0;
      const otherExpense = item.otherExpense ? item.otherExpense : 0;

      this.grandTotal +=
        saleQty * salePrice -
        unitTariff * pay_quantity +
        (driverLoan - otherExpense);
    });
  }

  //calculate remain amount
  calculateRemainAmount(event: any) {
    this.remainAmount = this.grandTotal - event.target.value;
    let msg = '';
    if (this.remainAmount < 0)
      msg = 'ከክፍያው መጠን ( ' + this.grandTotal + ' ) በላይ ነው ያስገባኸውና፤ ';
    if (this.remainAmount > 0) msg += '===> ቀሪ ክፍያ = ' + this.remainAmount;
    if (msg != '') this.toastr.info(msg);
  }
  //sale loaded cart items
  saleCartItems = () => {
    this.isClicked = true;
    setTimeout(() => {
      console.log();
    }, 1000);
    // if(!this.editData){
    // let bankId = this.cashoutForm.value.bank_id;
    let paidAmt = this.cashoutForm.value.paidAmount;
    // if (
    //   bankId === undefined ||
    //   bankId === '' ||
    //   bankId === '0' ||
    //   bankId === null
    // )
    //   bankId = 0;
    if (
      paidAmt === undefined ||
      paidAmt === null ||
      paidAmt === '' ||
      paidAmt === '0'
    )
      paidAmt = 0;
    // if ((paidAmt != 0 && bankId == 0) || (paidAmt == 0 && bankId != 0)) {
    //   this.toastr.error('የተክፍለ ወይም የባንክ መረጃ አልተሞላም፡፡', 'ስህተት');
    // } else
    if (this.cashoutForm.valid) {
      var myFormData = new FormData();
      myFormData.append('image', this.fileData);
      myFormData.append('customer_id', this.cashoutForm.value.customer_id);
      // myFormData.append('bank_id', bankId);
      myFormData.append('paidAmount', paidAmt);
      myFormData.append('moneyType', this.cashoutForm.value.moneyType);
      myFormData.append('exchangeRate', this.cashoutForm.value.exchangeRate);
      myFormData.append('remainAmount', this.cashoutForm.value.remainAmount);
      myFormData.append('items', JSON.stringify(this.carts));
      myFormData.append('orderFrom', this.carts[0].orderFrom);
      myFormData.append('remark', this.cashoutForm.value.remark);
      myFormData.append('createdBy', this.storex.getLoginUser());

      if (confirm('ለመሸጥ ያስጋባኸው መረጃ ትክክለኛ መሆኑን እርግጠኛ ነህ?')) {
        this.basketService.saleCartItems(myFormData).subscribe(
          (res) => this.handleResponse(res, this.carts[0].orderFrom),
          (error) => this.handleError(error)
        );
      }
    } else {
      this.toastr.error('የተሳሳት መረጃ ግብዓት', 'ስህተት');
    }
  };

  changeSalesQuantity(id: number) {
    this.selected = id;
    this.csqEditMode = !this.csqEditMode;
  }
  // bankSelected(){
  //   const id = this.cashoutForm.controls['bank_id'].value;
  //   this.bankService.getBankCountry(id).subscribe((res)=>{
  //     console.log(res)
  //     this.country = res.country;
  //     if(this.country != 'ኢትዮጵያ'){
  //       this.isAbroad = true;
  //     }
  //     else{
  //       this.isAbroad = false;
  //     }

  //   })
  // }

  //update loading unit tariff of single item
  setSalesQuantity(item: any, event: any) {
    const qty = event.target.value;
    this.csqEditMode = !this.csqEditMode;
    if (qty > item.quantity) this.toastr.error('No enough item found', 'Error');
    else {
      this.basketService.updateSalesQuantity(item, qty);
      // this.getAllBasketItems();
    }
  }

  changeSalesPrice(id: number) {
    this.selected = id;
    this.cspEditMode = !this.cspEditMode;
  }

  //update loading unit tariff of single item
  setSalesPrice(item: any, event: any) {
    const qty = event.target.value;
    this.cspEditMode = !this.cspEditMode;
    this.basketService.updateSalesPrice(item, qty);
    this.getAllBasketItems();
  }

  changeUnitTariffQuantity(id: number) {
    this.selected = id;
    this.cutqEditMode = !this.cutqEditMode;
  }

  //update loading unit tariff of single item
  setUnitTariffQuantity(item: any, event: any) {
    const qty = event.target.value;
    this.cutqEditMode = !this.cutqEditMode;
    this.basketService.updateUnitTariffQuantity(item, qty);
    this.getAllBasketItems();
  }

  changeUnitTariffPrice(id: number) {
    this.selected = id;
    this.cutpEditMode = !this.cutpEditMode;
  }

  //update loading unit tariff of single item
  setUnitTariffPrice(item: any, event: any) {
    const qty = event.target.value;
    this.cutpEditMode = !this.cutpEditMode;
    this.basketService.updateUnitTariffPrice(item, qty);
    this.getAllBasketItems();
  }

  changeDriverLoan(id: number) {
    this.selected = id;
    this.cdlEditMode = !this.cdlEditMode;
  }

  //update loading unit tariff of single item
  setDriverLoan(item: any, event: any) {
    const val = event.target.value;
    this.cdlEditMode = !this.cdlEditMode;
    this.basketService.updateDriverLoan(item, val);
    this.getAllBasketItems();
  }

  changeOtherExpense(id: number) {
    this.selected = id;
    this.coeEditMode = !this.coeEditMode;
  }

  //update loading unit tariff of single item
  setOtherExpense(item: any, event: any) {
    const val = event.target.value;
    this.coeEditMode = !this.coeEditMode;
    this.basketService.updateOtherExpense(item, val);
    this.getAllBasketItems();
  }

  handleResponse(data: any, page: any) {
    if (data.error) {
      this.toastr.error(data.message, data.title);
      this.router.navigateByUrl('/basket');
    } else {
      this.basketService.clearCart();
      this.toastr.success(data.message, data.title);
      //this.toastr.success('ክፍያው ወደ ባንክ ሂሳብ ገቢ ተደርጓል፡፡', 'ገቢ ሂሳብ');

      this.cashoutForm.reset();
      if (page == 'ከመኪና') this.router.navigateByUrl('/loads');
      else this.router.navigateByUrl('/stores/items');
    }
  }
  handleError(error: any) {
    this.toastr.error(error.error.message, error.error.title);
    this.error = error.error.errors;
  }

  removeFromCart(item: any) {
    this.basketService.removeCartItem(item);
    this.getAllBasketItems();
  }
  selectFileUpload(event: any) {
    this.fileData = event.target.files[0];
    this.selectedFile = this.fileData.name;

    let reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (e) => {
      this.imgUrl = reader.result;
    };
  }

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
