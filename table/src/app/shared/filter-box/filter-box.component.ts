import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { Options} from '@angular-slider/ngx-slider';  

export type DialogDataSubmitCallbackFilter<T> = (row: T) => void;


@Component({
  selector: 'app-filter-box',
  templateUrl: './filter-box.component.html',
  styleUrls: ['./filter-box.component.scss']
})
export class FilterBoxComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { fieldName: any,options:any}){
    console.log('box: ',this.data.fieldName," opt: ",this.data.options);
  }
  dropdownList :any;
  dropdownSettings:IDropdownSettings={};
  // value = 50;
  value: number = 50;  
maxvalue: number = 70;  
options: Options = {  
    floor: 0,  
    ceil: 100  
};  

  ngOnInit() {
    console.log("____: ",this.data.options)
    this.dropdownList = this.data.options.map((item:any, index:any) => {
      return {
        item_id: index + 1,
        item_text: item
      };
    });
    console.log("dl: ",this.dropdownList)
    // this.dropdownList = [
    //   { item_id: 1, item_text: 'Item1' },
    //   { item_id: 2, item_text: 'Item2' },
    //   { item_id: 3, item_text: 'Item3' },
    //   { item_id: 4, item_text: 'Item4' },
    //   { item_id: 5, item_text: 'Item5' }
    // ];
    this.dropdownSettings = {
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter:false,
      enableCheckAll:false
    };
  }
  
  
}
