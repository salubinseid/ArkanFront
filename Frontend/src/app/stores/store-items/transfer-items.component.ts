import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from 'src/app/Services/employee.service';
import { ItemService } from 'src/app/Services/item.service';
import { SharedService } from 'src/app/Services/shared.service';
import { StoreService } from 'src/app/Services/store.service';
import { StorexService } from 'src/app/Services/storex.service';
import { TokenService } from 'src/app/Services/token.service';

@Component({
  selector: 'app-transfer-items',
  templateUrl: './transfer-items.component.html',
  styleUrls: ['./transfer-items.component.css'],
})
export class TransferItemsComponent implements OnInit {
  public actionButton: string = 'መዝግብ';
  public form = { quantity: '', employee_id: '', itemId: '', store_id: '' };
  public employees: any;
  public stores: any;
  public items: any;
  public storeman: any;
  public loggedInUser: any;
  public itemId: any;
  public transferItem = '';
  isClicked = false;

  public error = '';

  itemTransferForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private empServise: EmployeeService,
    private storeService: StoreService,
    private tokenService: TokenService,
    private itemService: ItemService,
    private storexService: StorexService,
    private shared: SharedService,
    private toastr: ToastrService,
    private router: Router,
    private dialogRef: MatDialogRef<TransferItemsComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {}

  openDialog() {
    this.shared.openDialog(TransferItemsComponent, '', {
      height: '400px',
      width: '550px',
    });
  }

  displayItemName(subj: any) {
    return subj ? subj.itemName : undefined;
  }
  ngOnInit(): void {
    this.getLoggedInUser();
    this.getManagedStores();
    this.itemTransferForm = this.fb.group({
      store_item_id: [''],
      itemId: [''],
      store_from: ['', Validators.required],
      store_to: ['', Validators.required],
      quantity: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(/^\d+[.]?\d{0,2}$/),
        ],
      ],
      prevQty: [''],
      prevStore: [],
      remark: [''],
      createdBy: [this.loggedInUser],
    });
    this.getItems();

    this.itemTransferForm.controls['store_item_id'].setValue(this.editData.id);
    this.itemTransferForm.controls['itemId'].setValue(this.editData.itemId);
    this.itemTransferForm.controls['itemId'].disable();
    this.itemTransferForm.controls['store_from'].setValue(
      this.editData.store_id
    );
    this.itemTransferForm.controls['prevStore'].setValue(
      this.editData.store_id
    );

    this.itemTransferForm.controls['store_to'].setValue(this.editData.store_id);
    // this.itemTransferForm.controls['quantity'].setValue(this.editData.quantity);
    this.itemTransferForm.controls['prevQty'].setValue(this.editData.quantity);
    // this.itemTransferForm.controls['remark'].setValue(this.editData.remark);
    // this.itemTransferForm.controls['createdBy'].setValue(this.loggedInUser);
  }

  filteredItemId(event: any) {
    this.itemId = event.option.id;
  }
  getLoggedInUser() {
    this.loggedInUser = this.storexService.getLoginUser();
  }

  transferStoreItem() {
    this.isClicked = true;
    setTimeout(() => {
      console.log();
    }, 1000);
    console.log(this.itemTransferForm.value);

    if (this.itemTransferForm.valid) {
      const qty = this.itemTransferForm.get('quantity')?.value;
      const prevQty = this.itemTransferForm.get('prevQty')?.value;
      const fromStore = this.itemTransferForm.get('store_from')?.value;
      const toStore = this.itemTransferForm.get('store_to')?.value;

      if (fromStore != toStore) {
        if (prevQty >= qty) {
          const data = this.itemTransferForm.value;
          this.storeService.transferStoreItem(data).subscribe(
            (res) => {
              console.log(res);
              this.handleResponse(res);
            },
            (error) => this.handleError(error)
          );
        } else {
          this.isClicked = false;
          this.toastr.error(
            'የተጠየቀውን ያህል ዕቃ በመጋዘኑ ውስጥ የለም፡፡',
            'የተሳሳተ ግብዓት'
          );
        }
      } else {
        this.isClicked = false;
        this.toastr.error('ወደ ተመሳሳይ መጋዘን የዕቃ ዝውውር አይቻልም', 'የተሳሳተ ግብዓት');
      }
    }
  }

  getManagedStores() {
    this.storeService.getManagedStores(this.loggedInUser).subscribe(
      (res) => {
        this.stores = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getEmployees() {
    this.empServise.getEmployeesName().subscribe(
      (res) => {
        this.employees = res;
        console.log(this.employees);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getStores() {
    this.storeService.getStoresName().subscribe(
      (res) => {
        this.stores = res;
        // console.log(this.stores);
      },
      (error) => {
        console.log(error);
      }
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

  handleResponse(data: any) {
    this.toastr.success(data.message, data.title);
    this.dialogRef.close('save'); //this.toastr.info("Add item form closed","Form Close"));
  }
  handleError(error: any) {
    this.isClicked = false;
    this.toastr.error(error.message, error.title);
    this.error = error.message;
  }

  selectFromStore(e: any) {
    const id = e.target.value;
    this.storeService.getStoreMan(id).subscribe(
      (res) => {
        this.storeman = res;
        this.form.employee_id = res.id;
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  selectToStore(e: any) {
    const id = e.target.value;
    this.storeService.getStoreMan(id).subscribe(
      (res) => {
        this.storeman = res;
        this.form.employee_id = res.id;
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  hasPermission(val: any) {
    return this.storexService.hasPermission(val);
  }
}
