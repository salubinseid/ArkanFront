import { MedareshaService } from './../../Services/medaresha.service';
import { CustomerService } from './../../Services/customer.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/components/basket/basket.service';
import { CheckpointService } from 'src/app/Services/checkpoint.service';
import { LoadService } from 'src/app/Services/load.service';
import { SharedService } from 'src/app/Services/shared.service';
import { StorexService } from 'src/app/Services/storex.service';
import { LoadCreateComponent } from '../load-create/load-create.component';
import { UnloadComponent } from '../unload/unload.component';
import { MedareshaComponent } from 'src/app/components/medaresha/medaresha.component';
import { ItemService } from 'src/app/Services/item.service';

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.css'],
})
export class LoadComponent implements OnInit {
  loading: boolean = true;
  error = '';
  loads: any;
  load: any;
  price: number = 0;
  customers: any;

  productId: number = 0;
  soldTo: number = 0;

  editMode: boolean = false;
  cpEditMode: boolean = false;
  csEditMode: boolean = false;
  coeEditMode: boolean = false;
  cdlEditMode: boolean = false;
  cutEditMode: boolean = false;
  cspEditMode: boolean = false;
  status: string = '';
  store: string = '';
  stations: any = [];
  stores: any = [];
  itemTypes:any;

  totalItem: number = 0;
  totalOtherExpense: number = 0 ;
  totalDriverLoan: number=0;
  selected: any;
  showPayBtn: boolean = false;
  items: any;

  priceForm!: FormGroup;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  public filterData: string = '';
  public displayedColumns = [
    'id',
    'created_at',
    'itemName',
    'plateNum',
    'salesPrice',
    'quantity',
    'unitName',
    'pay_quantity',
    'unitTariff',
    'driverLoan',
    'otherExpense',
    'checkPointName',
    // 'storeName',
    'soldTo',
    'actions',
  ];
  public dataSource = new MatTableDataSource<any>();


  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  public doFilter() {
    this.dataSource.filter = this.filterData.trim().toLocaleLowerCase();
    this.calaculateTotal(this.dataSource.filteredData)
  }

  editStatus(id: number) {
    this.editMode = !this.editMode;
  }

  updateStatus() {
    //console.log(this.status);
  }

  constructor(
    private loadService: LoadService,
    private shared: SharedService,
    private basketService: BasketService,
    private toaster: ToastrService,
    private fb: FormBuilder,
    private storexService: StorexService,
    private router: Router,
    private custService: CustomerService,
    private medareshService: MedareshaService,
    private sorexService: StorexService,
    private itemService: ItemService

  ) {}

  ngOnInit(): void {
    this.getAllLoads();
    this.custService.getCustomersName().subscribe((res) => {
      this.customers = res;
    });
    this.priceForm = this.fb.group({
      id: ['', Validators.required],
      salesPrice: [0, Validators.required],
    });
    this.getItems();
  }

  addToCart(data: any) {
    data['orderFrom'] ='ከመኪና';
    data['salesQty'] =data.quantity

    if (
      data.salesPrice <= 0 ||
      data.salesPrice == null ||
      data.salesPrice == ''

    ) {

      this.toaster.error('በቅድሚያ የአንዱን ዕቃ መሸጫ ዋጋ ሙላ!', 'ዋጋ አልተሞላም');
    } else this.basketService.addToCart(data);
  }

  //add to stoe or unload
  unloadToStore(data: any) {
    this.openDialogToUnload(data);
  }

  //load add destonation tariff form
  registerMedareshaTariff = (data: any) => {
    // const data = {id:id, from:'LOAD_LIST_PAGE'}
    console.log('Data=>', data);
    this.shared.openDialog(MedareshaComponent, this.getAllLoads, {
      height: '500px',
      width: '650px',
      data: data,
    });
  };

  //set sales price of single item
  setSalesPrice(id: number, event: any) {
    this.selected = id;
    const price = event.target.value;
    const formData = new FormData();
    formData.append('salesPrice', price);
    this.loadService.updateUnitPrice(id, formData).subscribe(
      (res: any) => {
        this.cspEditMode = !this.cspEditMode;
        this.getAllLoads();
        this.toaster.success(res.message, res.title);
      },
      (err) => this.toaster.error(err.message, err.title)
    );
  }

  //update loading unit tariff of single item
  setLoadTariff(id: number, event: any) {
    const price = event.target.value;
    this.cutEditMode = !this.cutEditMode;
    const formData = new FormData();
    formData.append('unitTariff', price);
    this.loadService.updateLoadTariff(id, formData).subscribe(
      (res: any) => {
        this.getAllLoads();
        this.toaster.success(res.message, res.title);
      },
      (err) => this.toaster.error(err.message, err.title)
    );
  }

  changeSalesPrice(id: number) {
    this.selected = id;
    this.cspEditMode = !this.cspEditMode;
  }
  changeOtherExpense(id: number) {
    this.selected = id;
    this.coeEditMode = !this.coeEditMode;
  }
  changeDriverLoan(id: number) {
    this.selected = id;
    this.cdlEditMode = !this.cdlEditMode;
  }
  changeUnitTariff(id: number) {
    this.selected = id;
    this.cutEditMode = !this.cutEditMode;
  }
  changeCheckPoint(id: number) {
    this.selected = id;
    this.cpEditMode = !this.cpEditMode;
    this.stations = this.medareshService.getLoadMedaresha(id).subscribe(
      (response) => {
        this.stations = response;
      },
      (error) => {
        console.log('Error occured, No chekpoint');
      }
    );
  }
  //here change the next checkpoint or arrival station
  updateCheckpoint = (id: number, event: any) => {
    const checkPoint = event.target.value;
    const formData = new FormData();
    formData.append('nextCheckPoint', checkPoint);
    this.loadService.updateNextStation(id, formData).subscribe(
      (res: any) => {
        this.getAllLoads();
        this.toaster.success(res.message, res.title);
      },
      (err) => this.toaster.error(err.message, err.title)
    );
  };

  //set driver loan
  setDrivelLoan(id: number, event: any) {
    const loan = event.target.value;
    this.cdlEditMode = !this.cdlEditMode;

    const formData = new FormData();
    formData.append('driverLoan', loan);
    this.loadService.updateDriverLoan(id, formData).subscribe(
      (res: any) => {
        this.getAllLoads();
        this.toaster.success(res.message, res.title);
      },
      (err) => this.toaster.error(err.message, err.title)
    );
  }

  //set other expense for transporting
  setOtherExpense(id: number, event: any) {
    const expense = event.target.value;
    this.coeEditMode = !this.coeEditMode;

    const formData = new FormData();
    formData.append('otherExpense', expense);
    this.loadService.updateOtherExpense(id, formData).subscribe(
      (res: any) => {
        this.getAllLoads();
        this.toaster.success(res.message, res.title);
      },
      (err) => this.toaster.error(err.message, err.title)
    );
  }
  openDialog() {
    this.shared.openDialog(LoadCreateComponent, this.getAllLoads, {
      autoFocus: true,
      panelClass: 'my-custom-panel',
    });
  }
  openDialogForEdit(data: any) {
    this.shared.openDialog(LoadCreateComponent, this.getAllLoads, {
      autoFocus: true,
      panelClass: 'my-custom-panel',
      data: data,
    });
  }
  openDialogToUnload(data: any) {
    this.shared.openDialog(UnloadComponent, this.getAllLoads, {
      height: '420px',
      width: '750px',
      data: data,
    });
  }

  getAllLoads = () => {
    this.loadService.getAllLoads().subscribe(
      (result) => {
        this.items = result
        this.dataSource.data = result;
        this.loading = false;
        this.calaculateTotal(this.items)

      },
      (error) => {
        console.log('Error Occured ' + error);
        this.error = error.error;
        this.loading = false;
      }
    );
  };

  viewDetail(id: any) {
    this.router.navigate(['loads/detail', { id: id }]);
  }

  updateRecord(record: any) {
    this.openDialogForEdit(record);
  }

  //get single load  information
  public getLoad = (id: number) => {
    this.loadService.getLoad(id).subscribe(
      (res) => {
        this.load = res;
      },
      (error) => console.log(error)
    );
  };

  saleItemTo(data: any) {
    if (this.productId == data.id)
    {
      if ( data.salesPrice <= 0 ||  data.salesPrice == null || data.salesPrice == '')
        this.toaster.error('በቅድሚያ የአንዱን ዕቃ መሸጫ ዋጋ ሙላ!', 'ዋጋ አልተሞላም');
      else
      {
        //Sale this item to for the specified or selected Customer
        const formData = new FormData();
        formData.append('createdBy', this.sorexService.getLoginUser());
        formData.append('customerId', this.soldTo.toString());
        formData.append('itemId', data.itemId);
        if (
          confirm(
            data.quantity + ' የ' + data.itemName + ' አይነት ዕቃ ሽያጭ ለደንበኛው ይፈፀም?'
          )
        ) {
          this.basketService.saleItemToCustomer(data.id, formData).subscribe(
            (res) => this.handleResponse(res),
            (error) => this.handleError(error)
          );
        }
      }
    } else {
      this.toaster.error('ለተመረጠው ደንበኛ ብቻ ነው መሸጥ የምትችለው', 'የተሳሳት መረጃ');
    }
  }

  purchaser(data: any, event: any) {
    this.soldTo = event.target.value;
    console.log("Data  ", data)
    if(this.soldTo)
      this.showPayBtn = true;
    else
      this.showPayBtn = false;
    this.productId = data.id;
    this.toaster.info(data.itemName + ' saling to customer', 'Saling');
    console.log(data.id, this.soldTo);
  }

  deleteRecord(id: number) {
    this.getLoad(id);

    if (confirm('የጭነቱነ መረጃ መሰረዝ ትፈልጋለህ?')) {
      this.loadService.deleteLoad(id).subscribe(
        (res) => {
          this.toaster.success(' የጭነቱነ መረጃ በትክክል ተሰርዟል፡፡', 'በትክክል መሰረዝ');
          this.getAllLoads();
        },
        (error) => {
          this.toaster.error('የጭነቱነ መረጃ አልተሰረዘም፡', 'ያልተሳካ መሰረዝ');
        }
      );
    }
  }

  handleResponse(data: any) {
    // this.tokenService.handleToken(data.access_token);
    if (data.error) {
      this.toaster.error(data.message, data.title);
    } else {
      this.toaster.success(data.message, data.title);
    }
    this.getAllLoads();
  }
  handleError(error: any) {
    this.error = error.error.msg;
    this.toaster.error(error.error.msg, error.error.title);
  }
  loadSelectedItem(event:any)
  {
    let id = event.target.value;
    console.log(id)
    if(id == -1)
      this.getAllLoads();
    else
    {
      let temp= this.items.filter((p:any) => p.itemId == id);
      this.dataSource.data = temp
      this.calaculateTotal(temp);
    }
  }

  getItems() {
    this.itemService.getItemsName().subscribe(
      (res) => {
        this.itemTypes = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  calaculateTotal(res:any){
    this.totalOtherExpense = 0;
    this.totalItem = 0  ;
    this. totalDriverLoan=0;
    res.map((val:any)=>{
      this.totalDriverLoan+= val.driverLoan;
      this.totalOtherExpense+= val.otherExpense;
      this.totalItem+=val.quantity;
    })
  }


  hasPermission(val: any) {
    return this.storexService.hasPermission(val);
  }
}
