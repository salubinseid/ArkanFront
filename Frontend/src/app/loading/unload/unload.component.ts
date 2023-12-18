import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ItemCreateComponent } from 'src/app/item-create/item-create.component';
import { StoreService } from 'src/app/Services/store.service';
import { StorexService } from 'src/app/Services/storex.service';

@Component({
  selector: 'app-unload',
  templateUrl: './unload.component.html',
  styleUrls: ['./unload.component.css'],
})
export class UnloadComponent implements OnInit {
  public actionButton: string = 'መዝግብ';
  public stores: any;
  unLoadForm!: FormGroup;
  public loggedInUser: any;
  public error = '';
  // public form = { quantity: '', employee6_id: '', itemId: '', store_id: '' };
  public storeman: any;
  isClicked: boolean = false;

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private stX: StorexService,
    private router: Router,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<ItemCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private storex: StorexService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.stX.getLoginUser();
    this.getManagedStores();

    this.unLoadForm = this.fb.group({
      itemName: ['', Validators.required],
      itemId: ['', Validators.required],
      load_id: ['', Validators.required],
      store_id: ['', Validators.required],
      quantity: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(/^\d+[.]?\d{0,2}$/),
        ],
      ],
      unload_quantity: ['', Validators.required],
      plateNumber: ['', Validators.required],
      createdBy: [this.loggedInUser],
    });

    if (this.editData) {
      console.log('Date =>', this, this.editData);
      this.unLoadForm.controls['itemId'].setValue(this.editData.itemId);
      this.unLoadForm.controls['load_id'].setValue(this.editData.id);
      this.unLoadForm.controls['itemName'].setValue(this.editData.itemName);
      this.unLoadForm.controls['store_id'].setValue(this.editData.store_id);
      this.unLoadForm.controls['quantity'].setValue(this.editData.quantity);
      this.unLoadForm.controls['unload_quantity'].setValue(
        this.editData.quantity
      );
      this.unLoadForm.controls['plateNumber'].setValue(this.editData.plateNum);
      this.unLoadForm.controls['createdBy'].setValue(this.loggedInUser);
    }
  }

  selectStore(e: any) {
    const id = e.target.value;
    this.storeService.getStoreMan(id).subscribe(
      (res) => {
        this.storeman = res;
        // this.form.employee_id = res.id;
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  unloadItemToStore() {
    this.isClicked = true;
    setTimeout(() => {
      console.log();
    }, 1000);
    const loadedQty = this.unLoadForm.get('quantiy')?.value;
    const unLoadedQty = this.unLoadForm.get('unload_quantity')?.value;

    if (unLoadedQty > loadedQty) {
      this.toastr.error('የሚራገፍው ዕቃ ከተጫነው በላይ መሆን የለበትም፡፡');
    } else {
      if (confirm(`${unLoadedQty} ዕቃ ነው ማራገፍ የምትፈልገው? `)) {
        this.storeService.UnnlodItemToStore(this.unLoadForm.value).subscribe(
          (res) => this.handleResponse(res),
          (err) => this.handleError(err)
        );
      }
    }
  }

  getManagedStores() {
    this.storeService.getAllStores().subscribe(
      (res) => {
        this.stores = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  handleResponse(data: any) {
    if (data.error) {
      this.toastr.error(data.message, data.title);
    } else {
      this.toastr.success(data.message, data.title);
      this.unLoadForm.reset();
      this.dialogRef.close('save');
    }
    this.router.navigateByUrl('/stores/items');
  }
  handleError(error: any) {
    console.log(error);
    this.error = error.error.errors;
  }

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
