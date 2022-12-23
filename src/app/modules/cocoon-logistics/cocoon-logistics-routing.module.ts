import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CocoonLotLogisticsComponent } from './cocoon-lot-logistics/cocoon-lot-logistics.component';

const routes: Routes = [
  { path: '', component: CocoonLotLogisticsComponent },  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CocoonLogisticsRoutingModule { }
