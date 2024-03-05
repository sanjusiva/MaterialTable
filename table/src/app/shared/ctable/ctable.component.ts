import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TableService } from './table.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-ctable',
  templateUrl: './ctable.component.html',
  styleUrls: ['./ctable.component.scss']
})
export class CtableComponent implements OnChanges{
  ColNo:number=0;
  dataSource! : MatTableDataSource<any>;
  pageSize= [5, 10, 15, 20];  

  @Input() sharedDataSource!:MatTableDataSource<any>;
  @Input() totalRows!:number;
  @Input() ColHeader:any
  @ViewChild('paginator') paginator!: MatPaginator;
  @Output() paginationData : EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteData: EventEmitter<any> = new EventEmitter<any>();
  @Output() dialogOpenData: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterDialogOpen: EventEmitter<any> = new EventEmitter<any>();
  @Output() sortData: EventEmitter<any> = new EventEmitter<any>();


  constructor(public http:HttpClient,public dialog:MatDialog,private mockApiService:TableService ){}
  
 
  ngOnChanges(changes: SimpleChanges): void {
    console.log('total Rows',this.totalRows);
    console.log("sd: ",this.sharedDataSource);
   console.log("chc: ",this.ColHeader);
   this.dataSource=this.sharedDataSource;
   
  }
  sortDataFunc(event:any){
    console.log("sort: ",event);
    this.sortData.emit(event);
  }

  openDialog(id?:any): void {
    console.log("odid: ",id);
      this.dialogOpenData.emit({id,type:'form'})
  }

  DeleteField(id:any){
    console.log("del id: ",id);
    this.deleteData.emit({id,type:'box'});
  }

  ngAfterViewInit() {
    console.log("afterViewInit: ",this.paginator);
    this.paginationData.emit(this.paginator)
  }

  openFilter(){
    console.log("filter");
    this.filterDialogOpen.emit({type:'filter',fieldName:'Category'})
  }

  downloadData() {
    this.mockApiService.getMockData().subscribe((data) => {
      console.log("data: ",data)
      this.exportToExcel(data);
    });
  }

  exportToExcel(data: any[]) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    console.log("ws: ",worksheet)
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    console.log("wb: ",workbook)
    // const excelBuffer: any =  { byteLength: 54724 }
    const excelBuffer: any=XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    console.log("buffer: ",excelBuffer)//ArrayBuffer { byteLength: 54724 }
    this.saveAsExcelFile(excelBuffer, 'data');
  }

  saveAsExcelFile(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.ms-excel' });
    console.log("blob: ",data)
    const url: string = window.URL.createObjectURL(data);
    console.log("url: ",url)
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = url;
    a.download = fileName + '.xlsx';
    a.target = '_blank'; // Open in a new tab if you want
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
  downLoad(){
    // this.mockApiService.getBlob().subscribe((response: any) => {
		// 	let blob:any = new Blob([response], { type: 'text/json; charset=utf-8' });
		// 	const url = window.URL.createObjectURL(blob);
		// 	//window.open(url);
		// 	saveAs(blob, 'employees.json');
		// }), (error: any) => console.log('Error downloading the file'),
    //              () => console.info('File downloaded successfully');
  }


}

