import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { CountryService } from '../Services/country.service';
import { ExpenseService } from '../Services/expense.service';
import { ItemService } from '../Services/item.service';
import { MoneyTypeService } from '../Services/money-type.service';
import { PurchaseService } from '../Services/purchase.service';
import { SharedService } from '../Services/shared.service';
import { StorexService } from '../Services/storex.service';
import { UnitService } from '../Services/unit.service';
import { ItemCreateComponent } from '../item-create/item-create.component';
import { AddItemComponent } from '../stores/add-item/add-item.component';
import { StoreService } from '../Services/store.service';

@Component({
  selector: 'app-update-purchase-item',
  templateUrl: './update-purchase-item.component.html',
  styleUrls: ['./update-purchase-item.component.css'],
})
export class UpdatePurchaseItemComponent implements OnInit {
  public actionButton: string = 'ጨምርና ቀጥል';
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
  store = '';
  product = {
    lateArrivedQty: 0,
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
  // disableSelect = new FormControl(true);

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
  stores: any;
  updateLog: boolean = true;

  constructor(
    private fb: FormBuilder,
    private purchaedService: PurchaseService,
    private itemService: ItemService,
    private storexService: StorexService,
    private sorexService: StorexService,
    private shared: SharedService,
    private toastr: ToastrService,
    private unitService: UnitService,
    private expenseService: ExpenseService,
    private moneyTypeService: MoneyTypeService,
    private storeService: StoreService,
    private purchaseService: PurchaseService,
    private dialogRef: MatDialogRef<AddItemComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {}

  // openDialog() {
  //   debugger;
  //   this.shared.openDialog(ItemCreateComponent, '', {
  //     height: '550px',
  //     width: '550px',
  //     position: { right: '10px', top: '10px' },
  //   });
  // }
  displayItemName(subj: any) {
    return subj ? subj.itemName : undefined;
  }
  ngOnInit(): void {
    this.getAllStores();
    this.getLoggedInUser();
    this.getMoneyType();
    this.getUnit();
    this.getItems();
    this.loadForm();
  }

  loadForm() {
    this.addPurchasedItemForm = this.fb.group({
      loadingCode: [''],
      itemId: [
        { value: this.editData.itemId, disabled: true },
        Validators.required,
      ],
      unit: [{ value: this.editData.unit, disabled: true }],
      lateArrivedQty: [
        '',
        [Validators.maxLength(15), Validators.pattern(/^\d+[.]?\d{0,2}$/)],
      ],
      storeId: [this.editData.storeId, Validators.required],
      remainPaid: ['', [Validators.pattern(/^\d+[.]?\d{0,2}$/)]],
      exchangeRate: [1, [Validators.pattern(/^\d+[.]?\d{0,2}$/)]],
      remark: [''],
      createdBy: [this.sorexService.getLoginUser()],
    });

    //expense fprms
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
    if (this.editData && !this.editData.isNew) {
      this.actionButton = 'አስተካክልና ቀጥል';
      this.addPurchasedItemForm.controls['loadingCode'].setValue(
        this.editData.loadingCode
      );
      this.addPurchasedItemForm.controls['itemId'].setValue(
        this.editData.itemId
      );
      this.addPurchasedItemForm.controls['storeId'].setValue(
        this.editData.storeId
      );
      this.addPurchasedItemForm.controls['unit'].setValue(this.editData.unit);
      this.addPurchasedItemForm.controls['lateArrivedQty'].setValue(
        this.editData.lateArrivedQty
      );
      this.addPurchasedItemForm.controls['remainPaid'].setValue(
        this.editData.remainPaid
      );
      this.addPurchasedItemForm.controls['exchangeRate'].setValue(
        this.editData.exchangeRate
      );
      this.addPurchasedItemForm.controls['remark'].setValue(
        this.editData.remark
      );

      //for expense form
      if (this.editData.purchasedId) this.updateLog = false;
      this.purchasedId = this.editData.purchasedId ?? this.editData.id;
      this.getExpensesOfPurchasedItem(this.purchasedId);
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
  getLoggedInUser() {
    this.loggedInUser = this.storexService.getLoginUser();
  }

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
    let qty = this.addPurchasedItemForm.controls['lateArrivedQty'].value;
    let remainPaid = this.addPurchasedItemForm.controls['remainPaid'].value;
    // let storeId = this.addPurchasedItemForm.controls['storeId'].value;
    // let exchangeRate = this.addPurchasedItemForm.controls['exchangeRate'].value;
    // let loadingCode = this.addPurchasedItemForm.controls['loadingCode'].value;
    if (this.editData) {
      if (qty || remainPaid) {
        if (!this.editData.isNew) {
          this.purchasedId = this.editData.purchasedId ?? this.editData.id;
          this.purchaedService
            .updateRemainInfo(
              this.addPurchasedItemForm.value,
              this.purchasedId,
              this.editData.isNew
            )
            .subscribe(
              (res) => {
                this.success = true;
                this.getExpensesOfPurchasedItem(this.purchasedId);
                this.expenseForm.reset();
                this.dialogRef.close('update');
                this.handleResponse(res);
              },
              (error) => {
                this.isClicked = false;
                this.handleError(error);
              }
            );
        } else {
          this.purchaedService
            .recordRemainInfo(this.addPurchasedItemForm.value, this.editData.id)
            .subscribe(
              (res) => {
                this.success = true;
                this.purchasedId =
                  this.editData.purchasedId ?? this.editData.id;
                this.getExpensesOfPurchasedItem(this.purchasedId);
                this.addPurchasedItemForm.reset();
                this.dialogRef.close('save');
                this.handleResponse(res);
              },
              (error) => {
                this.isClicked = false;
                this.handleError(error);
              }
            );
        }
      } else {
        this.isClicked = false;
        this.toastr.error(
          'ተጨማሪ የደረሰ ዕቃ ወይም ቀሪ ከፍያ መርርጃ መሞላት አለበት፡፡',
          'ያልትሟላ ግብዓት'
        );
      }
    } else {
    }
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
    let lateArrivedQty = event.target.value;
    //this.addPurchasedItemForm.get['qty']?.value;
    this.product.lateArrivedQty = lateArrivedQty;
  }

  setProductUnitPrice(event) {
    let unitPrice = event.target.value;
    this.product.price = unitPrice;
    const total = (this.product.price * this.product.lateArrivedQty).toFixed(2);
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
          // this.dialogRef.close('save');
          this.handleResponse(res);
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
      this.addPurchasedItemForm.controls['unit'].setValue(this.unit);
      this.addPurchasedItemForm.controls['purchaseUnit'].setValue(
        this.purchaseUnit
      );
    });
  };
  handleResponse(data: any) {
    this.toastr.success(data.message, data.title);
  }
  handleError(error: any) {
    this.isClicked = false;
    this.toastr.error(error.error.message, error.error.title);
    this.error = error.message;
  }

  getAllStores() {
    console.log(this.shared.getStore());
    this.stores = this.shared.getStore();
    // this.storeService.getAllStores().subscribe(
    //   (res) => {
    //     this.stores = res;
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }
  public ItemDelivered = (event: any) => {
    this.addPurchasedItemForm.controls['storeId'].setValue(event.value);
  };

  hasPermission(val: any) {
    return this.storexService.hasPermission(val);
  }
}
