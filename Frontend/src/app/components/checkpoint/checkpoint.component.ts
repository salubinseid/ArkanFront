import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { CheckpointService } from 'src/app/Services/checkpoint.service';
import { SharedService } from 'src/app/Services/shared.service';
import { StorexService } from 'src/app/Services/storex.service';
import { CheckpointCreateComponent } from '../checkpoint-create/checkpoint-create.component';

@Component({
  selector: 'app-checkpoint',
  templateUrl: './checkpoint.component.html',
  styleUrls: ['./checkpoint.component.css']
})
export class CheckpointComponent implements OnInit {

  loading:boolean=true;
  error=''
  checkPoints:any;
  checkpoint:any;


  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, {static: false }) paginator!: MatPaginator;

  public filterData:string='';
  public displayedColumns =
  ['sno','checkPointName', 'manager','remark',  'created_at', 'actions'];
  public dataSource = new MatTableDataSource<any>();

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  public doFilter(){
    this.dataSource.filter = this.filterData.trim().toLocaleLowerCase();
  }


  constructor(private chService: CheckpointService, private storex:StorexService,
      private dialog:MatDialog,private toastr:ToastrService
    ) { }

  ngOnInit(): void {
    this.getAllCheckPoints();
  }


  openDialog() {
    let dialogRef = this.dialog.open(CheckpointCreateComponent,
      {height:'550px', width:'550px'}).afterClosed().subscribe(value =>{
        if(value==='save')
        {
          this.getAllCheckPoints()
        }
      });
  }

  openDialogForEdit(data:any) {
    this.dialog.open(CheckpointCreateComponent,
      {height:'550px', width:'550px',data:data}).afterClosed().subscribe(value =>{
        if(value==='update')
        {
          this.getAllCheckPoints();
        }
      });
    }

  getAllCheckPoints(){
    return this.chService.getAllCheckpoints().subscribe((res)=>{

        this.dataSource.data = res;
        this.loading=false;
      },
      error=>{
        console.log("Error Occured " + error);
        this.error=error.error
        this.loading=false;
      })
  }
  //get single bank account information
  public getCheckpoint = (id:number) =>{
    this.chService.getCheckpoint(id).subscribe(res=>{
      this.checkpoint = res;
    },
    error=> console.log(error))
  }

  viewDetail(id:any){

  }
  public updateRecord = (data: any) => {
      this.openDialogForEdit(data);
  }

  //delete bank record
  public deleteRecord = (data: any) => {
    // this.getCheckpoint(data.id);
    if(confirm('የ' + data.checkPointName + " መዳረሻን መሰረዝ ትፈልጋለህ?")) {
      this.chService.deleteCheckpoint(data.id).subscribe((res)=>{
        this.toastr.success( 'የ' + data.checkPointName + " መዳረሻ በትክክል ተሰርዟል፡፡",
          "በትክክል መሰረዝ");
        this.getAllCheckPoints();
      },
      (error) => {
        console.log(error);
        this.toastr.error("መዳረሻው አልተሰረዘም፡","ያልተሳካ መሰረዝ")

      });
    }
  }


  hasPermission(val:any){
    return this.storex.hasPermission(val);
  }

}
