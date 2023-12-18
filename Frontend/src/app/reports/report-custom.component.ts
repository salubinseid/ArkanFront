import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from './report.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../Services/customer.service';
import { ItemService } from '../Services/item.service';
import { SharedService } from '../Services/shared.service';
import { StoreService } from '../Services/store.service';
import { StorexService } from '../Services/storex.service';

@Component({
  selector: 'app-report-custom',
  templateUrl: './report-custom.component.html',
  styleUrls: ['./report-custom.component.css'],
})
export class ReportCustomComponent implements OnInit {
  reports: any;
  results: any = [];
  myDate = {
    from: '',
    to: '',
  };
  employees: any;
  flag = '';
  loading = true;
  error = '';
  sum = 0;
  gebi = 0;
  wechi = 0;
  selectedCategory = '';
  today: Date = new Date();
  summaryReportForm!: FormGroup;

  isClicked: boolean = false;
  items: any;
  stores: any;
  customers: any;

  purchaseSelected = false;
  saleSelected = false;
  storeSelected = false;
  paymentSelected = false;
  showItem = false;
  showCustomer = false;
  showStore = false;
  showOrderFrom = false;

  isThereData = false;

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  public filterData: string = '';
  public dataSource = new MatTableDataSource<any>();

  max: any = 0;
  min: any = 0;

  categoryList: string[] = ['ግዥ', 'ሽያጭ', 'ጭነት', 'ልዩ ልዩ ወጪ', 'የተላለፈ', 'መጋዘን'];
  orderFroms: string[] = ['ከመኪና', 'ከመጋዘን'];
  public displayedColumns: any[] = [];
  public columnHeaders: any[] = [];

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  totalOtherExpense: number = 0;
  totalDriverLoan: number = 0;
  totalPrice: number = 0;
  totalTransportCost: number = 0;
  itemTypes: any;
  totalItem: number = 0;
  grandTotal: number = 0;

  constructor(
    private reportService: ReportService,
    private shared: SharedService,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private itemService: ItemService,
    private custServcie: CustomerService,
    private storeService: StoreService,
    private storexService: StorexService
  ) {}

  public doFilter() {
    this.dataSource.filter = this.filterData.trim().toLocaleLowerCase();
  }
  ngOnInit(): void {
    this.loadForm();
  }

  loadForm() {
    let now = new Date();
    let monthAgo = new Date();
    monthAgo.setMonth(now.getMonth() - 1);
    this.summaryReportForm = this.fb.group({
      category: ['', Validators.required],
      item: [''],
      store: [''],
      customer: [''],
      orderFrom: [''],
      startDate: [monthAgo],
      endDate: [now],
    });
  }
  consoleMe(d) {
    console.log('Date ==', d.target.value);
  }
  // openDialog() {
  //   this.shared.openDialog(SummaryReportSelectorComponent, this.loadReport, {
  //     height: '300px',
  //     width: '650px',
  //   });
  // }

  loadReport() {
    // this.isClicked = true;
    setTimeout(() => {
      console.log();
    }, 1000);
    this.displayedColumns = [];
    this.selectedCategory = this.summaryReportForm.controls['category'].value;

    if (this.selectedCategory == 'ግዥ') {
      this.columnHeaders = [
        { name: 'created_at', label: 'ቀን' },
        { name: 'itemName', label: 'የዕቃ ስም' },
        { name: 'qty', label: 'ብዛት' },
        { name: 'unit', label: 'መለኪያ' },
        { name: 'gudlet', label: 'ጉድለት' },
        { name: 'unitPrice', label: 'የአንዱ ዋጋ' },
        { name: 'advancePaid', label: 'ቅድመ ክፍያ' },
        { name: 'remainPayment', label: 'ቀሪ ክፍያ' },
        { name: 'totalPrice', label: 'ጠቅላላ ክፍያ' },
        { name: 'moneyType', label: 'የገንዘብ አይነት' },
        { name: 'company', label: 'ካምፓኒ' },
      ];
      this.displayedColumns = this.columnHeaders.map((col) => col.name);
    } else if (this.selectedCategory == 'ሽያጭ') {
      this.columnHeaders = [
        { name: 'created_at', label: 'ቀን' },
        { name: 'itemName', label: 'የዕቃ ስም' },
        { name: 'itemQty', label: 'ብዛት' },
        { name: 'itemPrice', label: 'የተሽጠበት ዋጋ' },
        { name: 'loadingQty', label: 'የጭነት ብዛት' },
        { name: 'loadingPrice', label: 'የጭነት ዋጋ' },
        { name: 'driverLoan', label: 'ለሹፌር የተላክ ' },
        { name: 'otherExpense', label: 'ጉዞ ወጪ' },
        { name: 'orderFrom', label: 'ከ...' },
        { name: 'custName', label: 'የደንበኛ ስም' },
        // { name: 'transportRemark', label: 'የጉዞ መግለጫ' },
      ];
      this.displayedColumns = this.columnHeaders.map((col) => col.name);
    } else if (this.selectedCategory == 'ልዩ ልዩ ወጪ') {
      this.columnHeaders = [
        { name: 'created_at', label: 'ቀን' },
        { name: 'expenseName', label: 'የወጪ አይነት' },
        { name: 'amount', label: 'ወጪ የተደረገው መጠን' },
        { name: 'moneyType', label: 'የገንዘብ አይነት' },
        { name: 'description', label: 'መግለጫ' },
        { name: 'userName', label: 'መዝጋቢ' },
      ];
      this.displayedColumns = this.columnHeaders.map((col) => col.name);
    } else if (this.selectedCategory == 'የተላለፈ') {
      this.columnHeaders = [
        { name: 'created_at', label: 'ቀን' },
        { name: 'transferTo', label: 'የተላለፈለት አካል' },
        { name: 'amount', label: 'የተላለፈው መጠን' },
        { name: 'reason', label: 'መግለጫ' },
        { name: 'userName', label: 'መዝጋቢ' },
      ];
      this.displayedColumns = this.columnHeaders.map((col) => col.name);
    } else if (this.selectedCategory == 'ጭነት') {
      this.columnHeaders = [
        { name: 'created_at', label: 'ቀን' },
        { name: 'itemName', label: 'የዕቃ ስም' },
        { name: 'loadQty', label: 'ብዛት' },
        { name: 'quantity', label: ' ቀሪ ብዛት' },
        { name: 'salesPrice', label: 'መሸጫ ዋጋ' },
        { name: 'pay_quantity', label: 'የጭነት ስምምነት ብዛት' },
        { name: 'unitTariff', label: 'የመጫኛ ዋጋ' },
        { name: 'driverLoan', label: 'ለሹፌር የተላከ' },
        { name: 'otherExpense', label: 'የጉዞ ወጪ' },
        { name: 'plateNum', label: 'የመኪና ሰሌዳ' },
        // { name: 'custName', label: 'ገዥ' },
        // { name: 'declaration_num', label: 'የደንበኛ ስም' },
        // { name: 'status', label: 'ሁኔታ' },
      ];
      this.displayedColumns = this.columnHeaders.map((col) => col.name);
    } else if (this.selectedCategory == 'መጋዘን') {
      this.columnHeaders = [
        { name: 'updated_at', label: 'ቀን' },
        { name: 'itemName', label: 'የዕቃ ስም' },
        { name: 'brand', label: 'ብራንድ' },
        { name: 'itemQty', label: 'ብዛት' },
        { name: 'storeName', label: 'የመጋዘን ስም' },
        { name: 'location', label: 'የመጋዘን ቦታ' },
        { name: 'managedBy', label: 'ተቆጣጣሪ' },
        // { name: 'transportRemark', label: 'የጉዞ መግለጫ' },
      ];
      this.displayedColumns = this.columnHeaders.map((col) => col.name);
    } else if (this.selectedCategory == 'ባንክ') {
      this.columnHeaders = [
        { name: 'bankName', label: 'የባንክ ስም' },
        { name: 'branchName', label: 'ቅርንጫፍ' },
        { name: 'accountNumber', label: 'ሒሳብ ቁጥር' },
        { name: 'balance', label: 'ባላንስ' },
        { name: 'created_at', label: 'የተመዘገበበት ቀን' },
      ];
      this.displayedColumns = this.columnHeaders.map((col) => col.name);
    } else if (this.selectedCategory == 'ሒሳብ ማስተላለፊያ') {
      this.columnHeaders = [
        { name: 'bankName', label: 'የባንክ ስም' },
        { name: 'accountNumber', label: 'ሒሳብ ቁጥር' },
        { name: 'amount', label: 'የገንዘብ መጠን' },
        { name: 'inOut', label: 'ሁኔታ ' },
        { name: 'custName', label: 'የደንበኛ ስም' },
        { name: 'reason', label: 'ምርመራ' },
        { name: 'created_at', label: 'የተመዘገበበት ቀን' },
      ];
      this.displayedColumns = this.columnHeaders.map((col) => col.name);
    }

    if (this.selectedCategory != '') {
      this.myDate.from = this.summaryReportForm.controls['startDate'].value;
      this.myDate.to = this.summaryReportForm.controls['endDate'].value;

      this.reportService
        .getReportByCategory(this.summaryReportForm.value)
        .subscribe((res) => {
          this.reports = res;

          const length = this.reports.data ? this.reports.data.length : 0;
          this.dataSource = this.reports.data;
          if (length > 0) this.isThereData = true;
          else this.isThereData = false;

          this.sum = this.reports.sum ?? 0;
          this.gebi = this.reports.gebi ?? 0;
          this.wechi = this.reports.wechi ?? 0;

          if (this.selectedCategory == 'ሽያጭ') {
            this.calculateTotal(this.dataSource);
          }
          // this.loading = false;
        });
    } else {
      this.toaster.error('First Select the category', 'Invlaid Input');
    }
  }

  calculateTotal(res: any) {
    this.totalOtherExpense = 0;
    this.totalDriverLoan = 0;
    this.totalPrice = 0;
    this.totalTransportCost = 0;
    this.totalItem = 0;

    res.map((val: any) => {
      this.totalDriverLoan += val.driverLoan ? val.driverLoan : 0;
      this.totalOtherExpense += val.otherExpense ? val.otherExpense : 0;
      this.totalPrice += val.itemPrice * val.itemQty;
      this.totalItem += val.itemQty;
      this.totalTransportCost +=
        (val.loadingQty ? val.loadingQty : 0) *
        (val.loadingPrice ? val.loadingPrice : 0);
      this.grandTotal =
        this.totalPrice -
        this.totalTransportCost +
        this.totalDriverLoan -
        this.totalOtherExpense;
    });
  }

  hideDropDown() {
    this.showCustomer = false;
    this.showItem = false;
    this.showOrderFrom = false;
    this.showStore = false;
  }
  categorySelected(event: any) {
    this.getItems();
    this.getCustomers();
    this.getstores();

    const selected = event.value;
    this.hideDropDown();
    if (selected == 'ግዥ') {
      this.showItem = true;
    } else if (selected == 'ሽያጭ') {
      this.showItem = true;
      this.showCustomer = true;
      this.showOrderFrom = true;
    } else if (selected == 'መጋዘን') {
      this.showStore = true;
    } else if (selected == 'ጭነት') {
    } else if (selected == 'ባንክ') {
    } else if (selected == 'ሒሳብ ማስተላለፊያ') {
    }

    // console.log("Selcted Category : ", event.value);
  }
  orderCategorySelected(event: any) {
    const selected = event.target.value;
    if (selected == 'ከመጋዘን') {
      this.showStore = true;
    } else {
      this.summaryReportForm.controls['store'].setValue('');
      this.showStore = false;
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

  //getter function
  getCustomers = () => {
    this.custServcie.getCustomersName().subscribe((res) => {
      this.customers = res;
    });
  };

  getstores = () => {
    this.storeService.getStoresName().subscribe((res) => (this.stores = res));
  };

  // chek permission
  hasPermission(val) {
    return this.storexService.hasPermission(val);
  }
}
