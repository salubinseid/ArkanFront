import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from './report.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { StorexService } from '../Services/storex.service';
import { UnitService } from '../Services/unit.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-report-summary',
  templateUrl: './report-summary.component.html',
  styleUrls: ['./report-custom.component.css'],
})
export class ReportSummaryComponent implements OnInit {
  summaryReportForm!: FormGroup;
  reports: any;
  cutomers: any;
  items: any;
  stores: any;
  sales: any;
  summary: any;
  pipe = new DatePipe('en-US'); // Use your own locale

  // chkIitem=false;
  // chkCustomer= false;
  // chkSaleFrom=false;
  myDate = {
    from: new Date(),
    to: new Date(),
  };
  startDate = new FormControl(new Date());
  reportCategories = [
    // { key: 'net', label: 'የተጣራ' },
    { key: 'customer', label: 'የደንበኛ' },
    // { key: 'item', label: 'የዕቃ' },
    { key: 'salesByItem', label: 'የዕቃ ሽያጭ' },
    { key: 'salesFrom', label: 'የተሸጠበት ሁኔታ' },
    { key: 'purchase', label: 'የዕቃ ግዥ' },
    { key: 'transfer', label: 'የተላለፈ' },
    { key: 'expense', label: 'ልዩ ልዩ ወጪ' },
    { key: 'store', label: 'መጋዘን' },
  ];

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort1!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator1!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort2!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator2!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort3!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator3!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort4!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator4!: MatPaginator;

  public filterData: string = '';
  public dataSource = new MatTableDataSource<any>();

  categoryList: string[] = [
    'የደንበኛ',
    'የግዥ',
    'የሽያጭ',
    'የተሸጠበት ሁኔታ',
    'የልዩ ልዩ ወጪ',
    'የተላለፈ',
    'የመጋዘን',
    'የጭነት',
  ];
  orderFroms: string[] = ['ከመኪና', 'ከመጋዘን'];

  public displayedColumns: string[] = [];
  public displayedColumns1 = [
    'itemName',
    'brand',
    'totalQty',
    'totalSoldPrice',
    'totalTransportPrice',
    'totalDriverLoan',
    'totalTranportExpense',
    // 'net',
  ];
  public saleByItemColumns = [
    { name: 'itemName', label: 'የእቃ ስም', type: 'text', sum: false },
    { name: 'brand', label: 'የእቃው መለያ', type: 'text', sum: false },
    { name: 'totalQty', label: 'ጠ/ብዛት', type: 'number', sum: true },
    { name: 'totalSoldPrice', label: 'ጠ/ሽያጭ', type: 'number', sum: true },
    {
      name: 'totalTransportPrice',
      label: 'ጠ/የትራንስፖርት',
      type: 'number',
      sum: true,
    },
    { name: 'totalDriverLoan', label: 'ጠ/ለሹፌር የተላከ', type: 'number' },
    {
      name: 'totalTranportExpense',
      label: 'ጠ/የጉዞ ወጪ',
      type: 'number',
      sum: true,
    },
    // { name: 'net', label: 'የተጣራ', type: 'number' },
  ];

  public displayedColumns2 = [
    'custName',
    'debit',
    'totalSoldPrice',
    'totalTransportPrice',
    'totalDriverLoan',
    'totalTranportExpense',
    // 'totalPaid'
    // 'net',
  ];

  public customerColumns = [
    { name: 'custName', label: 'የደንበኛ ስም', type: 'text', sum: false },
    { name: 'debit', label: 'ቀሪ ዕዳ', type: 'text', sum: false },
    { name: 'totalSoldPrice', label: 'ጠ/ሽያጭ', type: 'number', sum: true },
    {
      name: 'totalTransportPrice',
      label: 'ጠ/የትራንስፖርት',
      type: 'number',
      sum: true,
    },
    {
      name: 'totalDriverLoan',
      label: 'ጠ/ለሹፌር የተላከ',
      type: 'number',
      sum: true,
    },
    {
      name: 'totalTranportExpense',
      label: 'ጠ/የጉዞ ወጪ',
      type: 'number',
      sum: true,
    },
    // 'totalPaid'
    // 'net',
  ];
  public displayedColumns3 = [
    'orderFrom',
    'totalSoldPrice',
    'totalTransportPrice',
    'totalDriverLoan',
    'totalTranportExpense',
    // 'net',
  ];
  public saleFromColumns = [
    { name: 'orderFrom', label: 'የመኪና/መጋዘን', type: 'text', sum: false },
    { name: 'totalSoldPrice', label: 'ጠ/ሽያጭ', type: 'number', sum: true },
    {
      name: 'totalTransportPrice',
      label: 'ጠ/የትራንስፖርት',
      type: 'number',
      sum: true,
    },
    {
      name: 'totalDriverLoan',
      label: 'ጠ/ለሹፌር የተላከ',
      type: 'number',
      sum: true,
    },
    {
      name: 'totalTranportExpense',
      label: 'ጠ/የጉዞ ወጪ',
      type: 'number',
      sum: true,
    },
    // { name: 'net', label: 'የተጣራ', type: 'number' },
  ];
  public displayedColumns4 = [
    'itemName',
    'brand',
    'totalQty',
    'totalGudelet',
    'wholePrice',
    'totalAdvancePaid',
    'totalRemain',
    'totalPrice',
  ];

  public purchaseColumns = [
    { name: 'itemName', label: 'የዕቃ ስም', type: 'text', sum: false },
    { name: 'brand', label: 'የዕቃ ብራንድ', type: 'text', sum: false },
    { name: 'totalQty', label: 'ጠ/ብዛት', type: 'number', sum: true },
    { name: 'totalGudelet', label: 'ጠ/ጉድለት', type: 'number', sum: true },
    { name: 'wholePrice', label: 'ብዛት X የአንዱ ዋጋ', type: 'number', sum: true },
    { name: 'totalAdvancePaid', label: 'ጠ/የተከፈለ', type: 'number', sum: true },
    { name: 'totalRemain', label: 'ጠ/ቀሪ', type: 'number', sum: true },
    { name: 'totalPrice', label: 'ጠ/ዋጋ', type: 'number', sum: true },
  ];

  public displayedColumns5 = [
    'fullName',
    // 'storeName',
    'totalSale',
    'totalLoading',
    'totalLoan',
    'totalTravelExpense',
    // 'totalExpense',
    // 'totalTransfer',
    // 'net',
  ];

  public displayedColumns6 = ['fullName', 'totalExpense', 'type'];

  public displayedColumns7 = ['fullName', 'totalTransfer'];

  public displayedColumns8 = [
    'itemName',
    'brand',
    'quantity',
    'unitName',
    // 'updated_at',
  ];

  public expenseColumns = [
    { name: 'fullName', label: 'የሰራተኛ ስም', type: 'text', sum: false },
    { name: 'totalExpense', label: 'ጠ/ልዩ ልዩ ወጪ', type: 'number', sum: true },
    { name: 'type', label: 'የገንዘብ አይነት', type: 'text', sum: false },
  ];

  public transferColumns = [
    { name: 'fullName', label: 'የሰራተኛ ስም', type: 'text', sum: false },
    { name: 'totalTransfer', label: 'ጠ/የተላለፈ', type: 'text', sum: true },
  ];

  public storeColumns = [
    { name: 'itemName', label: 'የዕቃ ስም', type: 'text', sum: false },
    { name: 'brand', label: 'የዕቃ ብራንድ', type: 'text', sum: false },
    { name: 'quantity', label: 'ጠ/ብዛት', type: 'number', sum: false },
    { name: 'unitName', label: 'መለኪያ', type: 'text', sum: false },
    // { name: 'updated_at', label: 'ቀን', type: 'date' },
  ];
  reportType: any;
  reportCategory: any;
  columnSchema: { name: string; label: string; type: string }[] = [];
  numItems = 0;
  reportHeader: string = '';
  fromDate: string | null = '';
  toDate: string | null = '';

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  constructor(
    private reportService: ReportService,
    private fb: FormBuilder,
    private storexService: StorexService,
    private unitService: UnitService // private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadForm();
    // this.getReportType();
    // this.reportService.getSummaryReport(null, this.reportType).subscribe(
    //   (res) => {
    //     this.reports = res;
    //     this.dataSource.data = this.reports?.result;
    //   },
    //   (error) => console.log(error)
    // );
  }

  loadForm() {
    let now = new Date();
    let monthAgo = new Date();
    monthAgo.setMonth(now.getMonth() - 1);
    this.summaryReportForm = this.fb.group({
      category: ['', Validators.required],
      startDate: [monthAgo],
      endDate: [now],
    });
  }

  loadReport() {
    // this.getReportType();
    setTimeout(() => {
      console.log();
    }, 1000);

    this.myDate.from = this.summaryReportForm.controls['startDate'].value;
    this.myDate.to = this.summaryReportForm.controls['endDate'].value;
    this.fromDate = this.pipe.transform(this.myDate.from, 'shortDate');
    this.toDate = this.pipe.transform(this.myDate.to, 'shortDate');
    this.reportType = this.summaryReportForm.controls['category'].value;
    this.reportService
      .getSummaryReport(this.summaryReportForm.value)
      .subscribe(
        (res) => {
          this.summary = res;
          if (this.reportType == 'የደንበኛ') {
            this.reportHeader = `ከቀን ${this.fromDate} እስከ ${this.toDate} ቀን በየደንበኛው የተፈፀመ ሽያጭ`;
            this.displayedColumns = this.displayedColumns2;
            this.columnSchema = this.customerColumns;
            this.dataSource.data = this.summary.result;
            this.numItems = this.summary.result.length;
          } else if (this.reportType == 'የሽያጭ') {
            this.reportHeader = `ከቀን ${this.fromDate} እስከ ${this.toDate} ቀን በየእቃ አይነቱ የተፈፀመ ሽያጭ`;
            this.displayedColumns = this.displayedColumns1;
            this.columnSchema = this.saleByItemColumns;
            this.dataSource.data = this.summary.result;
            this.numItems = this.summary.result.length;
          } else if (this.reportType == 'የግዥ') {
            this.reportHeader = `ከቀን ${this.fromDate} እስከ ${this.toDate} ቀን በየዕቃ አይነቱ የተፈፀመ ግዥ`;
            // this.netPurchaseSummary = this.summary.result[0];
            this.displayedColumns = this.displayedColumns4;
            this.dataSource.data = this.summary.result;
            this.numItems = this.summary.result.length;
            this.columnSchema = this.purchaseColumns;
          } else if (this.reportType == 'የተሸጠበት ሁኔታ') {
            this.displayedColumns = this.displayedColumns3;
            this.dataSource.data = this.summary.result;
            this.numItems = this.summary.result.length;
            this.columnSchema = this.saleFromColumns;
            this.reportHeader = `ከቀን ${this.fromDate} እስከ ${this.toDate} ቀን ከመጋዘንና ከመኪና የተፈፀመ ሽያጭ`;
          } else if (this.reportType == 'የተላለፈ') {
            this.dataSource.data = this.summary.result;
            this.numItems = this.summary.result.length;
            this.columnSchema = this.transferColumns;
            this.displayedColumns = this.displayedColumns7;
            this.reportHeader = `ከቀን ${this.fromDate} እስከ ${this.toDate} ቀን የተጣራ የተላለፈ`;
          } else if (this.reportType == 'የልዩ ልዩ ወጪ') {
            this.dataSource.data = this.summary.result;
            this.numItems = this.summary.result.length;
            this.columnSchema = this.expenseColumns;
            this.displayedColumns = this.displayedColumns6;
            this.reportHeader = `ከቀን ${this.fromDate} እስከ ${this.toDate} ቀን የተጣራ ልዩ ልዩ ወጪ`;
          } else if (this.reportType == 'የመጋዘን') {
            this.dataSource.data = this.addPurchasedItemType(
              this.summary.result
            );
            this.numItems = this.summary.result.length;
            this.columnSchema = this.storeColumns;
            this.displayedColumns = this.displayedColumns8;
            this.reportHeader = 'በአሁኑ ወቅት በሁሉም መጋዘን የሚገኘው የዕቃ ብዛት';
          }

          // this.netSaleSummary = this.summary.result[0];

          // this.numNetSummary = this.summary.netSummary.length;
          // this.numExpenseSummary = this.summary.netExpenseSummary.length;
          // this.numTransferSummary = this.summary.netTransferSummary.length;

          // net summary of all transaction
          // this.netSummary = this.summary.netSummary;
          // console.log('Netsales summary =>', this.netSummary);
        },
        (error) => console.log(error)
      );
  }

  addPurchasedItemType(storeSummaryByItem: any): any[] {
    storeSummaryByItem.map((x: any) => {
      x.purchaseUnit = this.getUnitName(x.purchaseUnit);
    });
    return storeSummaryByItem;
  }

  getUnitName = (id: number) => {
    this.unitService.get(id).subscribe((res) => res.name);
  };
  //check permission
  hasPermission(val: any) {
    return this.storexService.hasPermission(val);
  }
}
