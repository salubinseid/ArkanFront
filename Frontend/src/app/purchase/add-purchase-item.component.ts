import { UnitService } from './../Services/unit.service';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ItemCreateComponent } from '../item-create/item-create.component';
import { CountryService } from '../Services/country.service';
import { ItemService } from '../Services/item.service';
import { MoneyTypeService } from '../Services/money-type.service';
import { PurchaseService } from '../Services/purchase.service';
import { SharedService } from '../Services/shared.service';
import { StorexService } from '../Services/storex.service';
import { AddItemComponent } from '../stores/add-item/add-item.component';
import { ExpenseService } from '../Services/expense.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-add-purchase-item',
  templateUrl: './add-purchase-item.component.html',
  styleUrls: ['./add-purchase-item.component.css'],
})
export class AddPurchaseItemComponent implements OnInit {
  public actionButton: string = 'መዝግብ';
  public form = { quantity: '', employee_id: '', itemId: '', store_id: '' };
  public items: any;
  public countries: any;
  public units: any;
  public loggedInUser: any;
  public itemId: any;
  isClicked = false;
  ceaEditMode = false;
  ceaViewMode = false;
  selected: any;
  product = {
    qty: 0,
    purchaseQty: 0,
    price: 0,
    totalPrice: 0,
  };

  public error = '';

  addPurchasedItemForm!: FormGroup;
  public expenseForm!: FormGroup;
  expenseTypes: any;
  purchasedId: any;
  purchaseUnit: any;
  unit: any;

  moneyTypes: any;
  success: boolean = false;
  public dataSource = new MatTableDataSource<any>();
  public displayedColumns = [
    'updated_at',
    'expenseType',
    'amount',
    'type',
    'description',
    'createdBy',
    'actions',
  ];
  conversionFactor = 1;
  filteredCompanies: any;
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  companies: any = [];

  constructor(
    private fb: FormBuilder,
    private purchaedService: PurchaseService,
    private itemService: ItemService,
    private storexService: StorexService,
    private sorexService: StorexService,
    private shared: SharedService,
    private toastr: ToastrService,
    private countryService: CountryService,
    private unitService: UnitService,
    private expenseService: ExpenseService,
    private moneyTypeService: MoneyTypeService,
    private dialogRef: MatDialogRef<AddItemComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private router: Router
  ) {
    this.filteredCompanies = this.companies.slice();
  }

  filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredCompanies = this.companies.filter((o) =>
      o.toLowerCase().includes(filterValue)
    );
  }

  openDialog() {
    this.shared.openDialog(ItemCreateComponent, '', {
      height: '550px',
      width: '550px',
    });
  }
  displayItemName(subj: any) {
    return subj ? subj.itemName : undefined;
  }
  ngOnInit(): void {
    this.getLoggedInUser();
    this.getCountry();
    this.getMoneyType();
    this.getUnit();
    this.getAvailableCompanies();

    this.addPurchasedItemForm = this.fb.group({
      loadingCode: [''],
      itemId: ['', Validators.required],
      purchaseQty: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.maxLength(15),
          Validators.pattern(/^\d+[.]?\d{0,2}$/),
        ],
      ],
      unit: [1, Validators.required],
      conversionFactor: [1],
      purchaseUnit: [1, Validators.required],
      qty: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.maxLength(15),
          Validators.pattern(/^\d+[.]?\d{0,2}$/),
        ],
      ],
      unitPrice: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(/^\d+[.]?\d{0,2}$/),
        ],
      ],
      totalPrice: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(/^\d+[.]?\d{0,2}$/),
        ],
      ],
      advancePaid: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(/^\d+[.]?\d{0,2}$/),
        ],
      ],
      remainPayment: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(/^\d+[.]?\d{0,2}$/),
        ],
      ],
      exchangeRate: [
        1,
        [Validators.maxLength(15), Validators.pattern(/^\d+[.]?\d{0,2}$/)],
      ],
      moneyTypeId: [1, Validators.required],
      company: ['', Validators.required],
      countryId: [1, Validators.required],
      gudlet: [0],
      remark: [''],
      createdBy: [this.sorexService.getLoginUser()],
    });
    this.getItems();

    if (this.editData) {
      this.actionButton = 'አስተካክል';
      this.addPurchasedItemForm.controls['loadingCode'].setValue(
        this.editData.loadingCode
      );
      this.addPurchasedItemForm.controls['itemId'].setValue(
        this.editData.itemId
      );
      this.addPurchasedItemForm.controls['purchaseUnit'].setValue(
        this.editData.purchaseUnit
      );
      this.addPurchasedItemForm.controls['purchaseQty'].setValue(
        this.editData.purchaseQty
      );
      this.addPurchasedItemForm.controls['unit'].setValue(this.editData.unit);
      this.addPurchasedItemForm.controls['qty'].setValue(this.editData.qty);
      this.addPurchasedItemForm.controls['unitPrice'].setValue(
        this.editData.unitPrice
      );
      this.addPurchasedItemForm.controls['totalPrice'].setValue(
        this.editData.totalPrice
      );
      this.addPurchasedItemForm.controls['advancePaid'].setValue(
        this.editData.advancePaid
      );
      this.addPurchasedItemForm.controls['remainPayment'].setValue(
        this.editData.remainPayment
      );
      this.addPurchasedItemForm.controls['moneyTypeId'].setValue(
        this.editData.moneyTypeId
      );
      this.addPurchasedItemForm.controls['exchangeRate'].setValue(
        this.editData.exchangeRate
      );
      // this.addPurchasedItemForm.controls['gudlet'].setValue(this.editData.gudlet);
      this.addPurchasedItemForm.controls['company'].setValue(
        this.editData.company
      );
      this.addPurchasedItemForm.controls['countryId'].setValue(
        this.editData.countryId
      );
      this.addPurchasedItemForm.controls['remark'].setValue(
        this.editData.remark
      );
    }

    this.getExpenseTypes();
    this.getMoneyTypes();
    this.expenseForm = this.fb.group({
      expenseName: ['', Validators.required],
      amount: [
        '',
        [Validators.required, Validators.pattern(/^\d+[.]?\d{0,2}$/)],
      ],
      moneyType: ['', Validators.required],
      matchedId: [''],
      matchedEntity: [''],
      expenseExchangeRate: ['1'],
      description: [''],
      createdBy: [this.sorexService.getLoginUser()],
    });
    if (this.editData) {
      this.purchasedId = this.editData.id;
      this.getExpensesOfPurchasedItem(this.purchasedId);
      this.actionButton = 'አስተካክል';
      this.expenseForm.controls['expenseName'].setValue(
        this.editData.expenseName
      );
      this.expenseForm.controls['amount'].setValue(this.editData.amount);
      this.expenseForm.controls['moneyType'].setValue(this.editData.moneyType);
      this.expenseForm.controls['matchedId'].setValue(this.editData.matchedId);
      this.expenseForm.controls['matchedEntity'].setValue(
        this.editData.matchedEntity
      );
      this.expenseForm.controls['expenseExchangeRate'].setValue(
        this.editData.expenseExchangeRate
      );
      this.expenseForm.controls['description'].setValue(
        this.editData.description
      );
      this.expenseForm.controls['createdBy'].setValue(
        this.sorexService.getLoginUser()
      );
    }
  }

  filteredItemId(event: any) {
    this.itemId = event.option.id;
  }
  getAvailableCompanies() {
    this.purchaedService.getCompanies().subscribe((res) => {
      const result = res;
      this.companies = result['data'].map((o) => o.company);
    });
  }
  getLoggedInUser() {
    this.loggedInUser = this.storexService.getLoginUser();
  }

  getCountry = () => {
    this.countryService.getByName().subscribe(
      (res) => {
        this.countries = res;
      },
      (error) => console.log(error)
    );
  };

  getUnit = () => {
    this.unitService.getByName().subscribe(
      (res) => {
        this.units = res;
      },
      (error) => console.log(error)
    );
  };

  getMoneyType = () => {
    this.moneyTypeService.getByName().subscribe(
      (res) => {
        this.moneyTypes = res;
      },
      (error) => console.log(error)
    );
  };

  registerPurchasedItem() {
    this.isClicked = true;
    setTimeout(() => {
      console.log();
    }, 1000);
    if (!this.editData) {
      if (this.addPurchasedItemForm.valid) {
        const data = this.addPurchasedItemForm.value;
        this.purchaedService.register(data).subscribe(
          (res: any) => {
            let result = res;
            this.purchasedId = result.id;
            this.getExpensesOfPurchasedItem(this.purchasedId);
            this.handleResponse(result);
            this.success = true;
            this.dialogRef.close('save');
            this.addPurchasedItemForm.reset();
          },
          (error) => this.handleError(error)
        );
      }
    } else {
      this.updatePurchasedItem();
    }
  }

  //update exiting stored item information
  updatePurchasedItem() {
    this.purchaedService
      .put(this.addPurchasedItemForm.value, this.editData.id)
      .subscribe(
        (res) => {
          this.success = true;
          this.purchasedId = this.editData.id;
          this.getExpensesOfPurchasedItem(this.purchasedId);
          this.handleResponse(res);
        },
        (error) => this.handleError(error)
      );
  }

  getItems() {
    this.itemService.getItemsName().subscribe(
      (res) => {
        this.items = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  setProductQty(event) {
    let qty = event.target.value;
    this.product.purchaseQty = Number(qty);
    let q = this.addPurchasedItemForm.controls['conversionFactor']?.value;
    let totalQty = Number(q) * Number(qty);
    this.product.qty = totalQty;
    this.addPurchasedItemForm.controls['qty'].setValue(totalQty);
  }

  setProductUnitPrice(event) {
    let unitPrice = event.target.value;
    this.product.price = unitPrice;
    const total = (this.product.price * this.product.purchaseQty).toFixed(2);
    this.product.totalPrice = Number(total);
    this.addPurchasedItemForm.controls['totalPrice'].setValue(total);
  }

  calculateTotalPrice(event) {
    this.product.totalPrice = event.target.value;
  }

  setAdvancePaidAmount(event) {
    const advancePaidAmt = event.target.value;
    const remain = this.product.totalPrice - advancePaidAmt;
    this.addPurchasedItemForm.controls['remainPayment'].setValue(remain);
  }

  // add expense related functionality
  getMoneyTypes() {
    this.moneyTypeService.getByName().subscribe(
      (res) => {
        this.moneyTypes = res;
      },
      (error) => console.log(error)
    );
  }

  getExpensesOfPurchasedItem = (id: number) => {
    this.expenseService.getExpenseOfPurchased(id).subscribe(
      (result) => {
        this.dataSource.data = result;
        // this.calculateTotal(this.dataSource.data);
      },
      (error) => {
        this.error = error.error;
        // this.loading = false;
      }
    );
  };

  getExpenseTypes() {
    this.expenseService.getByName().subscribe(
      (res) => {
        this.expenseTypes = res;
      },
      (error) => console.log(error)
    );
  }
  addExpense() {
    // if (!this.editData) {
    this.expenseForm.controls['matchedId'].setValue(this.purchasedId);
    this.expenseForm.controls['matchedEntity'].setValue('purchases');

    if (this.expenseForm.valid) {
      this.expenseService.registerExpense(this.expenseForm.value).subscribe(
        (res) => {
          this.handleResponse(res);
          this.dialogRef.close('save');
          this.getExpensesOfPurchasedItem(this.purchasedId);
        },
        (error) => this.handleError(error)
      );
    } else {
      this.toastr.error('የተሳሳት መረጃ ግብዓት', 'ስህተት');
    }
    // } else {
    //   this.updateExpense();
    // }
  }

  updateExpense() {
    this.expenseService
      .putExpense(this.expenseForm.value, this.editData.id)
      .subscribe(
        (res: any) => {
          this.toastr.success(res.message, res.title);
          this.expenseForm.reset();
          this.dialogRef.close('update');
        },
        (error: any) => this.handleError(error)
      );
  }

  public deleteRecord = (data: any) => {
    if (confirm('የ ' + data.expenseType + ' ወጪን መሰረዝ ትፈልጋለህ?')) {
      this.expenseService.deleteExpense(data.id).subscribe(
        (res) => {
          const ctry = res;
          this.toastr.success(ctry.message, ctry.title);
          this.getExpensesOfPurchasedItem(this.purchasedId);
        },
        (error) => {
          this.toastr.error(' ወጩ አልተሰረዘም፡', 'ያልተሳካ መሰረዝ');
        }
      );
    }
  };
  changeExpenseAmount(data: any) {
    if (this.getTomorrow(data.created_at)) {
      this.selected = data.id;
      this.ceaEditMode = !this.ceaEditMode;
    }
  }

  //set sales price of single item
  setExpenseAmount(id: number, event: any) {
    this.selected = id;
    const price = event.target.value;
    const formData = new FormData();
    formData.append('expenseAmount', price);
    this.expenseService.updateExpenseAmount(id, formData).subscribe(
      (res: any) => {
        this.ceaEditMode = !this.ceaEditMode;
        this.getExpensesOfPurchasedItem(this.purchasedId);
        this.toastr.success(res.message, res.title);
      },
      (err) => this.toastr.error(err.message, err.title)
    );
  }

  getTomorrow = (date) => {
    let now = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    let dbDate = new Date(date);
    return dbDate < tomorrow;
  };

  selectItem = () => {
    const id = this.addPurchasedItemForm.controls['itemId'].value;
    this.itemService.getItemUnits(id).subscribe((res) => {
      this.unit = res.unit;
      this.purchaseUnit = res.purchaseUnit;
      this.conversionFactor = res.conversionFactor;

      this.addPurchasedItemForm.controls['unit'].setValue(this.unit);
      this.addPurchasedItemForm.controls['purchaseUnit'].setValue(
        this.purchaseUnit
      );
      this.addPurchasedItemForm.controls['conversionFactor'].setValue(
        this.conversionFactor
      );
    });
  };
  handleResponse(data: any) {
    this.toastr.success(data.message, data.title);
    this.router.navigateByUrl('/purchases');
  }
  handleError(error: any) {
    this.isClicked = false;
    this.toastr.error(error.error.message, error.error.title);
    this.error = error.message;
  }

  hasPermission(val: any) {
    return this.storexService.hasPermission(val);
  }
}
