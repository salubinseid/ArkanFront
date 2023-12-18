import { UnitService } from './../Services/unit.service';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  RequiredValidator,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../Services/employee.service';
import { ItemService } from '../Services/item.service';
import { StorexService } from '../Services/storex.service';
import { TokenService } from '../Services/token.service';

@Component({
  selector: 'app-item-create',
  templateUrl: './item-create.component.html',
  styleUrls: ['./item-create.component.css'],
})
export class ItemCreateComponent implements OnInit {
  public actionButton: string = 'መዝግብ';
  itemForm!: FormGroup;
  public error = '';
  isClicked: boolean = false;
  units: any;
  item: any;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private stX: StorexService,
    private router: Router,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<ItemCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private storex: StorexService,
    private unitService: UnitService
  ) {}

  ngOnInit(): void {
    // const id = this.
    this.getUnit();

    const id = this.stX.getLoginUser();
    this.itemForm = this.fb.group({
      itemName: ['', Validators.required],
      brand: ['', Validators.required],
      unit: [1, Validators.required],
      purchaseUnit: [1, Validators.required],
      conversionFactor: [1, Validators.required],
      // 'price':[0,Validators.required],
      createdBy: [id],
      description: [''],
    });
    if (this.editData) {
      this.item = this.editData;
      this.actionButton = 'አስተካክል';
      this.itemForm.controls['itemName'].setValue(this.editData.itemName);
      this.itemForm.controls['unit'].setValue(this.editData.unit);
      this.itemForm.controls['purchaseUnit'].setValue(
        this.editData.purchaseUnit
      );
      this.itemForm.controls['conversionFactor'].setValue(
        this.editData.conversionFactor
      );
      this.itemForm.controls['brand'].setValue(this.editData.brand);
      this.itemForm.controls['description'].setValue(this.editData.description);
      this.itemForm.controls['createdBy'].setValue(id);
      this.itemForm.controls['itemName'].setValue(this.editData.itemName);
    }
  }

  getUnit = () => {
    this.unitService.getByName().subscribe(
      (res) => {
        this.units = res;
      },
      (error) => console.log(error)
    );
  };

  addItem() {
    this.isClicked = true;
    setTimeout(() => {
      console.log();
    }, 1000);
    if (!this.editData) {
      if (this.itemForm.valid) {
        this.itemService.register(this.itemForm.value).subscribe(
          (res) => this.handleResponse(res),
          (error) => this.handleError(error)
        );
      } else {
        this.toastr.error('የተሳሳት መረጃ ግብዓት', 'ስህተት');
        this.isClicked = false;
      }
    } else {
      this.updateItem();
    }
  }

  updateItem() {
    this.itemService.putItem(this.itemForm.value, this.editData.id).subscribe(
      (res) => {
        this.toastr.success(res.message, res.title);
        this.itemForm.reset();
        this.dialogRef.close('update');
      },
      (error) => this.handleError(error)
    );
  }

  handleResponse(data: any) {
    if (data.error) {
      this.toastr.error(data.message, data.title);
    } else {
      this.toastr.success(data.message, data.title);
      this.itemForm.reset();
      this.dialogRef.close('save');
    }
    this.router.navigateByUrl('/items');
  }
  handleError(error: any) {
    this.error = error.error.message;
    this.isClicked = false;
  }

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
