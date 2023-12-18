import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StorexService } from 'src/app/Services/storex.service';
import { UnitService } from 'src/app/Services/unit.service';
import { StoreCreateComponent } from 'src/app/stores/store-create/store-create.component';

@Component({
  selector: 'app-add-unit',
  templateUrl: './add-unit.component.html',
  styleUrls: ['./add-unit.component.css'],
})
export class AddUnitComponent implements OnInit {
  public unitForm!: FormGroup;
  public actionButton: string = 'መዝግብ';
  public unit: any;
  public error = '';
  isClicked: boolean = false;

  constructor(
    private unitService: UnitService,
    private router: Router,
    private fb: FormBuilder,
    private storex: StorexService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<StoreCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {}

  ngOnInit(): void {
    this.unitForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
    // console.log(this.editData)
    if (this.editData) {
      this.actionButton = 'አስተካክል';
      this.unitForm.controls['name'].setValue(this.editData.name);
      this.unitForm.controls['description'].setValue(this.editData.description);
    }
  }
  addUnit() {
    this.isClicked = true;
    setTimeout(() => {
      console.log();
    }, 1000);
    if (!this.editData) {
      if (this.unitForm.valid) {
        this.unitService.register(this.unitForm.value).subscribe(
          (res) => this.handleResponse(res),
          (error) => this.handleError(error)
        );
      } else {
        this.toastr.error('የተሳሳት መረጃ ግብዓት', 'ስህተት');
      }
    } else {
      this.updateUnit();
    }
  }

  updateUnit() {
    this.unitService.put(this.unitForm.value, this.editData.id).subscribe(
      (res: any) => {
        this.toastr.success(res.message, res.title);
        this.unitForm.reset();
        this.dialogRef.close('update');
      },
      (error: any) => this.handleError(error)
    );
  }

  handleResponse(data: any) {
    if (data.error) {
      this.toastr.error(data.message, data.title);
    } else {
      this.toastr.success(data.message, data.title);
      this.unitForm.reset();
      this.dialogRef.close('save');
    }
    this.router.navigateByUrl('/units');
  }
  handleError(error: any) {
    this.toastr.error(error.error.message, error.error.title);
    this.isClicked = false;
    this.error = error.error.errors;
  }

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
