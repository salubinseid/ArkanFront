import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { CheckpointService } from 'src/app/Services/checkpoint.service';
import { CustomerService } from 'src/app/Services/customer.service';
import { LoadService } from 'src/app/Services/load.service';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StorexService } from 'src/app/Services/storex.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StoreService } from 'src/app/Services/store.service';
import { MedareshaService } from 'src/app/Services/medaresha.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-load-create',
  templateUrl: './load-create.component.html',
  styleUrls: ['./load-create.component.css'],
})
export class LoadCreateComponent implements OnInit {
  public employees: any;
  selectedFile!: any;
  public fileData: any;
  imgUrl: any;

  public items: any;
  public stores: any;
  public trucks: any;
  public customers: any;
  public rents: any;
  // public checkpoints: any;
  public loggedInUser: any;

  public actionButton: string = 'ጨምርና ቀጥል';
  loadForm!: FormGroup;

  public error = '';
  myControl = new FormControl();
  isClicked: boolean = false;

  firstFormGroup = this.fb.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this.fb.group({
    secondCtrl: ['', Validators.required],
  });
  loadId: any;
  loading: boolean = true;
  medareshas: any;
  medaresha: any;

  public displayedColumns = ['checkPointName', 'unitTariff'];
  public dataSource = new MatTableDataSource<any>();
  currentLoadId: any;
  loadMedareshaTariff: any;
  tariff: any;
  success: boolean = false;

  constructor(
    private fb: FormBuilder,
    private loadService: LoadService,
    private storeService: StoreService,
    private medareshaService: MedareshaService,
    private custService: CustomerService,
    private toastr: ToastrService,
    private router: Router,
    private storex: StorexService,
    private dialogRef: MatDialogRef<LoadCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.storex.getLoginUser();
    this.getAllMedareshas();
    if (this.editData) {
      this.medareshaService
        .getLoadMedaresha(this.editData.id)
        .subscribe((res) => {
          this.loadMedareshaTariff = res;
        });
      this.currentLoadId = this.editData.id;
    }
    this.storeService.getStoredItems(this.loggedInUser).subscribe((res) => {
      this.items = res;
    });
    // this.rentService.getRentsName().subscribe(res=>this.rents=res);
    this.custService
      .getCustomersName()
      .subscribe((res) => (this.customers = res));
    // this.cpService
    //   .getCheckpointsName()
    //   .subscribe((res) => (this.checkpoints = res));

    this.loadForm = this.fb.group({
      store_item_id: ['', Validators.required],
      declaration_num: [''],
      quantity: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern(/^\d+[.]?\d{0,2}$/),
        ],
      ],
      pay_quantity: [
        '',
        [Validators.required, Validators.pattern(/^\d+[.]?\d{0,2}$/)],
      ],
      // unitTariff: ['', [Validators.required, Validators.pattern(/^\d+[.]?\d{0,2}$/)], ],
      plateNum: ['', Validators.required],
      driverName: ['', Validators.required],
      driverPhone: [
        '',
        [
          Validators.required,
          Validators.pattern('^((\\+[0-9]{3}?)|0)?[0-9]{9}$'),
          Validators.maxLength(13),
          Validators.minLength(10),
        ],
      ],
      driverPhoneDj: [
        '',
        [
          Validators.pattern('^((\\+[0-9]{3}?)|00+[0-9]{3}?)?[0-9]{8}$'),
          Validators.maxLength(14),
          Validators.minLength(8),
        ],
      ],
      // checkpoint_id: ['', Validators.required],
      createdBy: [this.loggedInUser],
      license: [''],
      status: [''],
      remark: [''],
    });
    if (this.editData) {
      this.loadForm.controls['store_item_id'].setValue(
        this.editData.store_item_id
      );
      this.loadForm.controls['declaration_num'].setValue(
        this.editData.declaration_num
      );

      this.loadForm.controls['quantity'].setValue(this.editData.quantity);
      this.loadForm.controls['pay_quantity'].setValue(
        this.editData.pay_quantity
      );
      // this.loadForm.controls['unitTariff'].setValue(this.editData.unitTariff);
      this.loadForm.controls['plateNum'].setValue(this.editData.plateNum);
      this.loadForm.controls['plateNum'].setValue(this.editData.plateNum);
      this.loadForm.controls['driverName'].setValue(this.editData.driverName);
      this.loadForm.controls['driverPhone'].setValue(this.editData.driverPhone);

      this.loadForm.controls['driverPhoneDj'].setValue(
        this.editData.driverPhoneDj
      );
      this.loadForm.controls['license'].setValue(this.editData.license);
      // this.loadForm.controls['checkpoint_id'].setValue(
      //   this.editData.checkpoint_id
      // );
      this.loadForm.controls['remark'].setValue(this.editData.remark);
      this.loadForm.controls['status'].setValue(this.editData.status);
      this.loadForm.controls['createdBy'].setValue(this.loggedInUser);
    }
  }

  loadItem() {
    this.isClicked = true;
    setTimeout(() => {
      console.log();
    }, 1000);
    if (!this.editData) {
      if (this.loadForm.valid) {
        this.loadService.register(this.loadForm.value).subscribe(
          (res) => this.handleResponse(res),
          (error) => this.handleError(error)
        );
      } else {
        this.toastr.error('የተሳሳት መረጃ ግብዓት', 'ስህተት');
        this.isClicked = false;
      }
    } else {
      this.updateLoad();
    }
  }

  updateLoad() {
    this.loadService.putLoad(this.loadForm.value, this.editData.id).subscribe(
      (res) => {
        this.toastr.success(res.msg, res.title);
        this.loadForm.reset();
        this.dialogRef.close('update');
      },
      (error) => this.handleError(error)
    );
  }

  getAllMedareshas = () => {
    this.medareshaService.getAll().subscribe(
      (result) => {
        this.dataSource.data = result.filter((c) => c.checkPointName !== 'ጅቡቲ');
        this.loading = false;
      },
      (error) => {
        this.error = error.error;
        this.loading = false;
      }
    );
  };

  closeModal() {
    this.loadForm.reset();
    this.dialogRef.close('save');
    this.router.navigateByUrl('/loads');
  }

  updateMedareshTariff(id: number, event: any) {
    //const loadId = this.medareshaForm.controls['load_id'].value;
    //const medareshaId = this.medareshaForm.controls['medareshaId'].value;
    // console.log(
    //   'While update Loaded Id =>',
    //   this.currentLoadId,
    //   '===========>',
    //   id
    // );
    const price = event.target.value;
    const formData = new FormData();
    formData.append('unitTariff', price);
    formData.append('medareshaId', id.toString());
    formData.append('load_id', this.loadId);
    formData.append('createdBy', this.storex.getLoginUser());

    this.loadService.updateMedareshTariff(formData, id).subscribe(
      (res) => {
        this.toastr.success(res.message, res.title);
      },
      (err) => this.toastr.error(err.message, err.title)
    );
  }

  handleResponse(data: any) {
    // this.tokenService.handleToken(data.access_token);
    if (data.error) {
      this.toastr.error(data.message, data.title);
    } else {
      this.success = true;
      this.toastr.success(data.message, data.title);
      this.loadId = data?.id;
      console.log('LoadId', data.id);
      //this.loadForm.reset();
      //this.dialogRef.close('save');
    }
    // this.router.navigateByUrl('/loads');
  }
  handleError(error: any) {
    this.isClicked = false;
    this.error = error.error.msg;
    this.toastr.error(error.error.msg, error.error.title);
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

  get quantity() {
    return this.loadForm.get('quantity');
  }
  get pay_quantity() {
    return this.loadForm.get('pay_quantity');
  }
  get unitTariff() {
    return this.loadForm.get('unitTariff');
  }

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
