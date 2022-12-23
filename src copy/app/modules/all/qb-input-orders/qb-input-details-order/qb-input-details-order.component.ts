import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import { Items } from 'src/app/model/qbuster/Invoice.model';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-qb-input-details-order',
  templateUrl: './qb-input-details-order.component.html',
  styleUrls: ['./qb-input-details-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QbInputDetailsOrderComponent implements OnInit {
  details:Data;
  searchText1:any='';
  itemList:Items[];
  flag:any=false;
  constructor(private globalService: GlobalService) { }
  tableHeaders:any=[
    {name:"charges",sort:true},
    {name:"discount_total",sort:true},
    {name:"product id",sort:true},
    {name:"price",sort:true,type:"Price"},
    {name:"quantity",sort:true},
    {name:"discounts",sort:true},
    {name:"taxes",sort:true},
    {name:"title",sort:true},
    {name:"total",sort:true},
    {name:"total_with_tax",sort:true},
    {name:"unit",sort:true},
    {name:"brand",sort:true},
    {name:"category",sort:true},
    {name:"sub_category",sort:true},
    {name:"barcode",sort:true},
    {name:"sku",sort:true},
    {name:"hsn_code",sort:true},
 ];

  ngOnInit(): void {
    this.details=this.globalService.tempValueData;
    if(this.globalService.tempValueData.details&&this.globalService.tempValueData.details.items[0])
    this.itemList=this.globalService.tempValueData.details.items.map(ele=>{
      ele.charges=ele.charges[0].rate;
      ele.discounts=ele.discounts[0].discount_value;
     (typeof(ele.taxes)=='object'&&ele.taxes[0])&&(ele.taxes=ele.taxes[0].rate);
      return ele;
   });
   this.flag=this.globalService.tempValueData;
   if(!this.globalService.tempValueData)
    history.back()
  }

  back(){
    history.back();
  }
}
