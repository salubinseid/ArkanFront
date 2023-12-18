import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from 'src/app/Services/employee.service';
import { ItemService } from 'src/app/Services/item.service';
import { StoreService } from 'src/app/Services/store.service';
import { StorexService } from 'src/app/Services/storex.service';
import { TokenService } from 'src/app/Services/token.service';
import { ItemCreateComponent } from 'src/app/item-create/item-create.component';
import { SharedService } from 'src/app/Services/shared.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
})
export class AddItemComponent implements OnInit {
  public actionButton: string = 'መዝግብ';
  public form = { quantity: '', employee_id: '', itemId: '', store_id: '' };
  public employees: any;
  public stores: any;
  public items: any;
  public storeman: any;
  public loggedInUser: any;
  public itemId: any;
  isClicked = false;

  public error = '';

  addItemToStoreForm!: FormGroup;

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
    private dialogRef: MatDialogRef<AddItemComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {}

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
    this.getManagedStores();
    this.addItemToStoreForm = this.fb.group({
      itemId: ['', Validators.required],
      store_id: ['', Validators.required],
      quantity: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(/^\d+[.]?\d{1,2}$/),
        ],
      ],
      remark: [''],
      createdBy: [this.loggedInUser],
    });
    this.getItems();

    if (this.editData) {
      this.actionButton = 'አስተካክል';
      this.addItemToStoreForm.controls['itemId'].setValue(
        this.editData.itemId
      );
      this.addItemToStoreForm.controls['store_id'].setValue(
        this.editData.store_id
      );
      this.addItemToStoreForm.controls['quantity'].setValue(
        this.editData.quantity
      );
      this.addItemToStoreForm.controls['remark'].setValue(this.editData.remark);
      this.addItemToStoreForm.controls['createdBy'].setValue(this.loggedInUser);
    }
  }

  filteredItemId(event: any) {
    this.itemId = event.option.id;
  }
  getLoggedInUser() {
    this.loggedInUser = this.storexService.getLoginUser();
  }
  addItemToStore() {
    this.isClicked = true;
    setTimeout(() => {
      console.log();
    }, 1000);
    if (!this.editData) {
      if (this.addItemToStoreForm.valid) {
        // console.log(this.addItemToStoreForm.value);
        const data = this.addItemToStoreForm.value;
        this.storeService.addItem(data).subscribe(
          (res) => this.handleResponse(res),
          (error) => this.handleError(error)
        );
      }
    } else {
      this.updateItemsInStore();
    }
  }

  //update exiting stored item information
  updateItemsInStore() {
    this.storeService
      .putStoredItem(this.addItemToStoreForm.value, this.editData.id)
      .subscribe(
        (res) => {
          this.handleResponse(res);
        },
        (error) => this.handleError(error)
      );
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
        console.log(this.items);
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
    this.toastr.error(error.message, error.title);
    this.error = error.message;
  }

  selectStore(e: any) {
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
