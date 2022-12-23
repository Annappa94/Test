import { NgModule, Component, OnInit } from '@angular/core';
import { RouterModule, Routes, PreloadingStrategy, PreloadAllModules} from '@angular/router';
import { AppComponent } from './app.component';
const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'farmers-silk',
        loadChildren: () =>
          import('./modules/cocoon-farmer/cocoon-farmer.module').then((m) => m.CocoonFarmerModule),
      },

      {
        path: 'cocoon-lot',
        loadChildren: () =>
          import('./modules/cocoon-lot/cocoon-lot.module').then((m) => m.CocoonLotModule),
      },
      
      
      {
        path: 'kyc-form',
        loadChildren: () =>
          import('./modules/kyc/kyc.module').then((m) => m.KycModule),
      },

      {
        path: 'farmers-kyc',
        loadChildren: () =>
          import('./modules/cocoon-farmer-kyc/cocoon-farmer-kyc.module').then((m) => m.CocoonFarmerKycModule),
       },
       
      {
        path: 'dispatched-lots',
        loadChildren: () =>
          import('./modules/cocoon-logistics/cocoon-logistics.module').then((m) => m.CocoonLogisticsModule),
      },
      {
        path: 'cocoon-logistics-partners',
        loadChildren: () =>
          import('./modules/farms-logistics/farms-logistics.module').then((m) => m.FarmsLogisticsModule),
      },
      {
        path: 'farms-logistics',
        loadChildren: () =>
          import('./modules/farms-logistics/farms-logistics.module').then((m) => m.FarmsLogisticsModule),
      },

      {
        path: 'bid',
        loadChildren: () =>
          import('./modules/bidding-system/bidding-system.module').then((m) => m.BiddingSystemModule),
       },
       {
        path: 'cocoon-orders',
        loadChildren: () =>
          import('./modules/cocoon-order/cocoon-order.module').then((m) => m.CocoonOrderModule),
       },

       {
        path: 'cotton-farmers',
        loadChildren: () =>
          import('./modules/Farmer/farmer.module').then((m) => m.FarmerModule),
       },
       {
        path: 'cottonlot',
        loadChildren: () =>
          import('./modules/cotton-lot/cotton-lot.module').then((m) => m.CottonLotModule),
       },

       {
        path: 'cotton-orders',
        loadChildren: () =>
          import('./modules/cotton-order/cotton-order.module').then((m) => m.CottonOrderModule),
       },

       {
        path: 'cotton-bale-po',
        loadChildren: () =>
          import('./modules/cotton-balles/bales-purchase-performa/bales-purchase-performa.module').then((m) => m.BalesPurchasePerformaModule),
       },

       {
        path: 'bale-purchases',
        loadChildren: () =>
          import('./modules/cotton-balles/bales-purchases/bales-purchases.module').then((m) => m.BalesPurchasesModule),
       },

       {
        path: 'bale-sales',
        loadChildren: () =>
          import('./modules/cotton-balles/bales-sales-order/bales-sales-order.module').then((m) => m.BalesSalesOrderModule),
       },

       {
        path: 'bales-production',
        loadChildren: () =>
          import('./modules/bales-production/bales-production.module').then((m) => m.BalesProductionModule),
        },


       {
        path: 'oil-spinning-mills',
        loadChildren: () =>
          import('./modules/oil-spinning-mill/oil-spinning-mill.module').then((m) => m.OilSpinningMillModule),
       },

       {
        path: 'ginners',
        loadChildren: () =>
          import('./modules/ginner/ginner.module').then((m) => m.GinnerModule),
       },

       {
        path: 'spinning-mills',
        loadChildren: () =>
          import('./modules/spinning-mills/spinning-mills.module').then((m) => m.SpinningMillsModule),
       },


       {
        path: 'cotton-logistic',
        loadChildren: () =>
          import('./modules/cotton-logistic/cotton-logistic.module').then((m) => m.CottonLogisticModule),
       },

       {
        path: 'rm-pupae-suppliers',
        loadChildren: () =>
          import('./modules/pupae/pupae.module').then((m) => m.PupaeModule),
       },
       {
        path: 'rm-pupae-buyers',
        loadChildren: () =>
          import('./modules/pupae-buyers/pupae-buyers.module').then((m) => m.PupaeBuyersModule),
       },
       {
        path: 'rm-pupae-lot',
        loadChildren: () =>
          import('./modules/pupae-lot/pupae-lot.module').then((m) => m.PupaeLotModule),
       },
       {
        path: 'pupae-order',
        loadChildren: () =>
          import('./modules/pupae-order/pupae-order.module').then((m) => m.PupaeOrderModule),
       },

       

       {
        path: 'farmers',
        loadChildren: () =>
          import('./modules/Farmer/farmer.module').then((m) => m.FarmerModule),
       },
       {
        path: 'tussar',
        loadChildren: () =>
          import('./modules/tussar/tussar.module').then((m) => m.TussarModule),
        },
        {
          path: 'chawki',
          loadChildren: () =>
            import('./modules/chawki/chawki.module').then((m) => m.ChawkiModule),
         },
         {
          path: 'chawki-orders',
          loadChildren: () =>
            import('./modules/chawki-order/chawki-order.module').then((m) => m.ChawkiOrderModule),
         },
         {
          path: '',
          loadChildren: () =>
            import('./modules/all/all.module').then((m) => m.AllModule),
          },

          {
            path: 'farm-marketplace',
            loadChildren: () =>
              import('./modules/farm-marketplace/farm-marketplace.module').then((m) => m.FarmMarketplaceModule),
          },
          {
            path: 'rearing-iot',
            loadChildren: () =>
              import('./modules/iot/iot.module').then((m) => m.IotModule),
           },
           {
            path: 'device-management',
            loadChildren: () => import('./modules/iot/device-management/device-management.module').then((m) => m.DeviceManagementModule),
          },
          {
           path: 'mulberry-iot',
           loadChildren: () => import('./modules/iot/mulberry-iot/mulberry-iot.module').then((m) => m.MulberryIotModule),
           },
           
          {
           path: 'rearing-iot',
           loadChildren: () => import('./modules/iot/rearing-iot/rearing-iot.module').then((m) => m.RearingIotModule),
           }, 
          {
           path: 'iot/subscription',
           loadChildren: () => import('./modules/iot/subscription-paln/subscription-paln.module').then((m) => m.SubscriptionPalnModule),
           },

           

           {
            path: 'cotton-bales/inventary-dashboard',
            loadChildren: () =>
              import('./modules/bale-inventary-dashboard/bale-inventary-dashboard.module').then((m) => m.BaleInventaryDashboardModule),
           },
           {
            path: 'cotton-bales',
            loadChildren: () =>
              import('./modules/cotton-bale-inventory/cotton-bale-inventory.module').then((m) => m.CottonBaleInventoryModule),
           },

           {
            path: 'rearing-iot-depricted',
            loadChildren: () =>
              import('./modules/iot/iot.module').then((m) => m.IotModule),
           },
           {
            path: 'Cotton-Seeds-purchase',
            loadChildren: () =>
              import('./modules/cotton-seeds-sales/cotton-seeds-sales.module').then((m) => m.CottonSeedsSalesModule),
           },


           {
            path: 'cotton-seeds-order',
            loadChildren: () =>
              import('./modules/cottonseeds/cottonseeds.module').then((m) => m.CottonseedsModule),
           },


    ]
  },
];
@NgModule({
  
  imports: [RouterModule.forChild(routes)],
  
  exports: [RouterModule]
})
export class AppRoutingModule { }
