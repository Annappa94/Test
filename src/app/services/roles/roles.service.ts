import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  appRoles = [
    {
      role: 'ADMINISTRATOR',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
  
              {
                section: 'rmPupae',
                items: 'all'
              },
              {
                section: 'rmFarms',
                items: 'all'
              },
              {
                section: 'rmCotton',
                items: 'all'
              },
              {
                section: 'rmSathi',
                items: 'all'
              },
              {
                section: 'rmCare',
                items: 'all'
              },
              {
                section: 'rmReels',
                items: 'all'
              },
              {
                section: 'rmWeaves',
                items: 'all'
              },
              {
                section: 'rmRetailers',
                items: 'all'
              },
              {
                section: 'reshaMudra',
                items: 'all'
              }
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'adminstration',
          items: 'all'
        },
        {
          section: 'reports',
          items: 'all'
        },
        {
          section: 'collections',
          items: 'all'
        },
        {
          section: 'accounts',
          items: 'all'
        },
        {
          section: 'sourcing',
          items: 'all'
        }
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: ['edit']
        },
        {
          component: 'CocoonListComponent',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'DispatchedCocoonLots',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'CocoonDetailsComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'CocoonOrdersComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'CocoonOrderDetailsComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'ReelerDetailsComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'YarnListingComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'YarnOrdersComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'YarnOrderDetailsComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'WeaverDetailsComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'YarnDetailsComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        }
      ],
    },
    {
      role: 'FinanceManager',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
  
              {
                section: 'rmPupae',
                items: 'all'
              },
              {
                section: 'rmFarms',
                items: 'all'
              },
              {
                section: 'rmCotton',
                items: 'all'
              },
              {
                section: 'rmSathi',
                items: 'all'
              },
              {
                section: 'rmCare',
                items: 'all'
              },
              {
                section: 'rmReels',
                items: 'all'
              },
              {
                section: 'rmWeaves',
                items: 'all'
              },
              {
                section: 'rmRetailers',
                items: 'all'
              },
              {
                section: 'reshaMudra',
                items: 'all'
              }
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'adminstration',
          items: 'all'
        },
        {
          section: 'reports',
          items: 'all'
        },
        {
          section: 'accounts',
          items: 'all'
        }
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: ['edit']
        },
        {
          component: 'CocoonListComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'DispatchedCocoonLots',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'CocoonDetailsComponent',
          action: ['edit', 'invoice', 'payment']
        },
        {
          component: 'CocoonOrdersComponent',
          action: ['edit', 'invoice', 'payment']
        },
        {
          component: 'CocoonOrderDetailsComponent',
          action: ['edit', 'invoice', 'payment']
        },
        {
          component: 'ReelerDetailsComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'YarnListingComponent',
          action: ['edit', 'invoice', 'payment']
        },
        {
          component: 'YarnOrdersComponent',
          action: ['edit', 'invoice', 'payment']
        },
        {
          component: 'YarnOrderDetailsComponent',
          action: ['edit', 'invoice', 'payment']
        },
        {
          component: 'WeaverDetailsComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'YarnDetailsComponent',
          action: ['edit', 'invoice', 'payment']
        }
      ],
    },
    {
      role: 'FinanceHead',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
  
              {
                section: 'rmPupae',
                items: 'all'
              },
              {
                section: 'rmSathi',
                items: 'all'
              },
              {
                section: 'rmFarms',
                items: 'all'
              },
              {
                section: 'rmCotton',
                items: 'all'
              },
              {
                section: 'rmReels',
                items: ['yarnBookings']
              },
              {
                section: 'rmWeaves',
                items: 'all'
              },
              {
                section: 'rmRetailers',
                items: 'all'
              }
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'adminstration',
          items: 'all'
        },
        {
          section: 'reports',
          items: 'all'
        },
        {
          section: 'accounts',
          items: 'all'
        }
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: ['edit']
        },
        {
          component: 'CocoonListComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'DispatchedCocoonLots',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'CocoonDetailsComponent',
          action: ['edit', 'invoice', 'payment']
        },
        {
          component: 'CocoonOrdersComponent',
          action: ['edit', 'invoice', 'payment']
        },
        {
          component: 'CocoonOrderDetailsComponent',
          action: ['edit', 'invoice', 'payment']
        },
        {
          component: 'ReelerDetailsComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'YarnListingComponent',
          action: ['edit', 'invoice', 'payment']
        },
        {
          component: 'YarnOrdersComponent',
          action: ['edit', 'invoice', 'payment']
        },
        {
          component: 'YarnOrderDetailsComponent',
          action: ['edit', 'invoice', 'payment']
        },
        {
          component: 'WeaverDetailsComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'YarnDetailsComponent',
          action: ['edit', 'invoice', 'payment']
        }
      ],
    },
    
    {
      role: 'READADMIN',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
  
              {
                section: 'rmPupae',
                items: 'all'
              },
              {
                section: 'rmFarms',
                items: 'all'
              },
              {
                section: 'rmCotton',
                items: 'all'
              },
              {
                section: 'rmSathi',
                items: 'all'
              },
              {
                section: 'rmCare',
                items: 'all'
              },
              {
                section: 'rmReels',
                items: 'all'
              },
              {
                section: 'rmWeaves',
                items: 'all'
              },
              {
                section: 'rmRetailers',
                items: 'all'
              }
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'adminstration',
          items: 'all'
        },
        {
          section: 'reports',
          items: 'all'
        }
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: []
        },
        {
          component: 'CocoonListComponent',
          action: []
        },
        {
          component: 'DispatchedCocoonLots',
          action: []
        },
        {
          component: 'CocoonDetailsComponent',
          action: []
        },
        {
          component: 'CocoonOrdersComponent',
          action: []
        },
        {
          component: 'CocoonOrderDetailsComponent',
          action: []
        },
        {
          component: 'ReelerDetailsComponent',
          action: []
        },
        {
          component: 'YarnListingComponent',
          action: []
        },
        {
          component: 'YarnOrdersComponent',
          action: []
        },
        {
          component: 'YarnOrderDetailsComponent',
          action: []
        },
        {
          component: 'WeaverDetailsComponent',
          action: []
        },
        {
          component: 'YarnDetailsComponent',
          action: []
        }
      ],
    },
    {
      role: 'CottonManager',
      menu: [
  
  
              {
                section: 'rmPupae',
                items: 'all'
              },
              {
                section: 'rmCotton',
                items: 'all'
              },
              {
                section: 'rmFarms',
                items: 'all'
              },
            ],
      topMenu: [
        {
          section: 'followUps',
          items: ['myFollowUps']
        },
        {
          section: 'reports',
          items: 'all'
        }
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: ['edit']
        },
        {
          component: 'CottonLotListComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'CottonLotListDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'GinnerListComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'CottonSalesOrderComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'CottonSalesOrderDetailsComponent',
          action: ['edit', 'invoice']
        }
      ],
    },
    {
      role: 'CottonAgent',
      menu: [
              {
                section: 'rmCotton',
                items: 'all'
              },
              {
                section: 'rmFarms',
                items: 'all'
              },
            ],
      topMenu: [
        {
          section: 'followUps',
          items: ['myFollowUps']
        }
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: ['edit']
        },
        {
          component: 'CottonLotListComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'CottonLotListDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'GinnerListComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'CottonSalesOrderComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'CottonSalesOrderDetailsComponent',
          action: ['edit', 'invoice']
        }
      ],
    },
    {
      role: 'COperationsManager',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
              {
                section: 'rmFarms',
                items: 'all'
              },
              {
                section: 'rmReels',
                items: 'all'
              },
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'reports',
          items: ['allReports']
        }
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: ['edit']
        },
        {
          component: 'CocoonListComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'DispatchedCocoonLots',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'CocoonDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'CocoonOrdersComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'CocoonOrderDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'ReelerDetailsComponent',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'YarnListingComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnOrdersComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnOrderDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'WeaverDetailsComponent',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'YarnDetailsComponent',
          action: ['edit', 'invoice']
        }
      ],
    },
    {
      role: 'COCOON_PROCUREMENT_MANAGER',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
              {
                section: 'rmFarms',
                items: 'all'
              },
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: ['edit']
        },
        {
          component: 'CocoonListComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'DispatchedCocoonLots',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'CocoonDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'CocoonOrdersComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'CocoonOrderDetailsComponent',
          action: ['edit', 'invoice']
        },
      ],
    },
    {
      role: 'COCOON_SALES_MANAGER',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
              {
                section: 'rmFarms',
                items: 'all'
              },
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: ['edit']
        },
        {
          component: 'CocoonListComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'DispatchedCocoonLots',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'CocoonDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'CocoonOrdersComponent',
          action: ['edit', 'invoice', 'payment']
        },
        {
          component: 'CocoonOrderDetailsComponent',
          action: ['edit', 'invoice', 'payment']
        },
      ],
    },
    {
      role: 'COperationsAgent',
      menu: [
  
              {
                section: 'rmFarms',
                items: 'all'
              },
            ],
      topMenu: [
        {
          section: 'followUps',
          items: ['myFollowUps']
        },
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: ['edit']
        },
        {
          component: 'CocoonListComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'DispatchedCocoonLots',
          action: ['edit', 'invoice']
        },
        {
          component: 'CocoonDetailsComponent',
          action: ['edit', 'invoice']
        }
      ],
    },
    {
      role: 'COCOON_PROCUREMENT_EXEC',
      menu: [
  
              {
                section: 'rmFarms',
                items: 'all'
              },
            ],
      topMenu: [
        {
          section: 'followUps',
          items: ['myFollowUps']
        },
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: ['edit']
        },
        {
          component: 'CocoonListComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'DispatchedCocoonLots',
          action: ['edit', 'invoice']
        },
        {
          component: 'CocoonDetailsComponent',
          action: ['edit', 'invoice']
        }
      ],
    },
    {
      role: 'COCOON_SALES_EXEC',
      menu: [
  
              {
                section: 'rmFarms',
                items: 'all'
              },
            ],
      topMenu: [
        {
          section: 'followUps',
          items: ['myFollowUps']
        },
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: ['edit']
        },
        {
          component: 'CocoonListComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'DispatchedCocoonLots',
          action: ['edit', 'invoice']
        },
        {
          component: 'CocoonDetailsComponent',
          action: ['edit', 'invoice']
        },
             {
          component: 'CocoonOrdersComponent',
          action: ['edit', 'invoice', 'payment']
        },
        {
          component: 'CocoonOrderDetailsComponent',
          action: ['edit', 'invoice', 'payment']
        },
      ],
    },

    {
      role: 'COperationsAgent,FinanceManager',
      menu: [
  
              {
                section: 'rmFarms',
                items: 'all'
              },
              {
                section: 'rmReels',
                items: 'all'
              },
              {
                section: 'rmPupae',
                items: 'all'
              },
              {
                section: 'rmCotton',
                items: 'all'
              },
            ],
      topMenu: [
        {
          section: 'followUps',
          items: ['myFollowUps']
        },
        {
          section: 'reports',
          items: ['allReports']
        }
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: ['edit']
        },
        {
          component: 'CocoonListComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'DispatchedCocoonLots',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'CocoonDetailsComponent',
          action: ['edit', 'invoice', 'payment']
        },
        {
          component: 'CocoonOrdersComponent',
          action: ['edit', 'invoice', 'payment']
        },
        {
          component: 'CocoonOrderDetailsComponent',
          action: ['edit', 'invoice', 'payment']
        },
        {
          component: 'ReelerDetailsComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
      ],
    },
    {
      role: 'Agronomist',
      menu: [
  
              {
                section: 'rmSathi',
                items: 'all'
              },
            ],
      topMenu: [
  
        {
          section: 'adminstration',
          items: 'all'
        },
      ],
      actions: [
  
  
      ],
    },
    {
      role: 'CCenterManager',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
              {
                section: 'rmSathi',
                items: 'all'
              },
              {
                section: 'rmFarms',
                items: 'all'
              },
              {
                section: 'rmCare',
                items: 'all'
              },
              {
                section: 'rmReels',
                items: 'all'
              },
              {
                section: 'rmWeaves',
                items: 'all'
              },
              {
                section: 'rmRetailers',
                items: 'all'
              },
              {
                section: 'rmPupae',
                items: 'all'
              },
              {
                section: 'rmCotton',
                items: 'all'
              },
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'reports',
          items: ['allReports']
        }
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: []
        },
        {
          component: 'CocoonListComponent',
          action: []
        },
        {
          component: 'DispatchedCocoonLots',
          action: []
        },
        {
          component: 'CocoonDetailsComponent',
          action: []
        },
        {
          component: 'CocoonOrdersComponent',
          action: []
        },
        {
          component: 'CocoonOrderDetailsComponent',
          action: []
        },
        {
          component: 'ReelerDetailsComponent',
          action: []
        },
        {
          component: 'YarnListingComponent',
          action: []
        },
        {
          component: 'YarnOrdersComponent',
          action: []
        },
        {
          component: 'YarnOrderDetailsComponent',
          action: []
        },
        {
          component: 'WeaverDetailsComponent',
          action: []
        },
        {
          component: 'YarnDetailsComponent',
          action: []
        }
      ],
    },
    {
      role: 'CCenterAgent',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
              {
                section: 'rmSathi',
                items: 'all'
              },
              {
                section: 'rmFarms',
                items: 'all'
              },
              {
                section: 'rmCare',
                items: 'all'
              },
              {
                section: 'rmReels',
                items: 'all'
              },
              {
                section: 'rmWeaves',
                items: 'all'
              },
              {
                section: 'rmRetailers',
                items: 'all'
              },
              {
                section: 'rmPupae',
                items: 'all'
              },
              {
                section: 'rmCotton',
                items: 'all'
              },
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        }
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: []
        },
        {
          component: 'CocoonListComponent',
          action: []
        },
        {
          component: 'DispatchedCocoonLots',
          action: []
        },
        {
          component: 'CocoonDetailsComponent',
          action: []
        },
        {
          component: 'CocoonOrdersComponent',
          action: []
        },
        {
          component: 'CocoonOrderDetailsComponent',
          action: []
        },
        {
          component: 'ReelerDetailsComponent',
          action: []
        },
        {
          component: 'YarnListingComponent',
          action: []
        },
        {
          component: 'YarnOrdersComponent',
          action: []
        },
        {
          component: 'YarnOrderDetailsComponent',
          action: []
        },
        {
          component: 'WeaverDetailsComponent',
          action: []
        },
        {
          component: 'YarnDetailsComponent',
          action: []
        }
      ],
    },
    {
      role: 'YOperationsManager',
      menu: [
              
              {
                section: 'rmReels',
                items: 'all'
              },
              {
                section: 'rmWeaves',
                items: 'all'
              },
            ],
      topMenu: [
        {
          section: 'followUps',
          items: ['myFollowUps']
        },
        {
          section: 'reports',
          items: ['allReports']
        }
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: ['edit']
        },
        {
          component: 'CocoonListComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'DispatchedCocoonLots',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'CocoonDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'CocoonOrdersComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'CocoonOrderDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'ReelerDetailsComponent',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'YarnListingComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnOrdersComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnOrderDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'WeaverDetailsComponent',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'YarnDetailsComponent',
          action: ['edit', 'invoice']
        }
      ],
    },
    {
      role: 'YOperationsAgent',
      menu: [
  
              {
                section: 'rmReels',
                items: 'all'
              },
              {
                section: 'rmWeaves',
                items: 'all'
              },
            ],
      topMenu: [
        {
          section: 'followUps',
          items: ['myFollowUps']
        },
        {
          section: 'reports',
          items: ['allReports']
        }
      ],
      actions: [
        {
          component: 'CocoonOrdersComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'CocoonOrderDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'ReelerDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnListingComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnDetailsComponent',
          action: ['edit', 'invoice']
        }
      ],
    },
    {
      role: 'FarmInputManager',
      menu: [
              {
                section: 'rmCare',
                items: 'all'
              },
              {
                section: 'rmSathi',
                items: 'all'
              },
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'reports',
          items: ['allReports']
        }
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: ['edit']
        },
        {
          component: 'CocoonListComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'DispatchedCocoonLots',
          action: ['edit', 'invoice']
        },
        {
          component: 'CocoonDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'CocoonOrdersComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'CocoonOrderDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'ReelerDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnListingComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnOrdersComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnOrderDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'WeaverDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnDetailsComponent',
          action: ['edit', 'invoice']
        }
      ],
    },
    {
      role: 'FarmInputAgent',
      menu: [
              {
                section: 'rmCare',
                items: 'all'
              },
              {
                section: 'rmSathi',
                items: 'all'
              },
            ],
      topMenu: [
        {
          section: 'followUps',
          items: ['myFollowUps']
        }
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: ['edit']
        },
        {
          component: 'CocoonListComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'DispatchedCocoonLots',
          action: ['edit', 'invoice']
        },
        {
          component: 'CocoonDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'CocoonOrdersComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'CocoonOrderDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'ReelerDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnListingComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnOrdersComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnOrderDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'WeaverDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnDetailsComponent',
          action: ['edit', 'invoice']
        }
      ],
    },
    {
      role: 'RetailSalesManager',
      menu: [
              
              {
                section: 'rmWeaves',
                items: 'all'
              },
              {
                section: 'rmRetailers',
                items: 'all'
              }
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'reports',
          items: ['allReports']
        }
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: ['edit']
        },
        {
          component: 'CocoonListComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'DispatchedCocoonLots',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'CocoonDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'CocoonOrdersComponent',
          action: ['edit', 'invoice','payment']
        },
        {
          component: 'CocoonOrderDetailsComponent',
          action: ['edit', 'invoice','payment']
        },
        {
          component: 'ReelerDetailsComponent',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'YarnListingComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnOrdersComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnOrderDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'WeaverDetailsComponent',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'YarnDetailsComponent',
          action: ['edit', 'invoice']
        }
      ],
    },
    {
      role: 'RetailSalesAgent',
      menu: [
  
              {
                section: 'rmRetailers',
                items: 'all'
              },
              {
                section: 'rmWeaves',
                items: 'all'
              }
            ],
      topMenu: [
        {
          section: 'followUps',
          items: ['myFollowUps']
        },
        {
          section: 'reports',
          items: ['allReports']
        }
      ],
      actions: [
        {
          component: 'CocoonOrdersComponent',
          action: ['edit', 'invoice','payment']
        },
        {
          component: 'CocoonOrderDetailsComponent',
          action: ['edit', 'invoice','payment']
        },
        {
          component: 'ReelerDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnListingComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnDetailsComponent',
          action: ['edit', 'invoice']
        }
      ],
    },
    {
      role: 'RetailSourcingManager',
      menu: [
              
              {
                section: 'rmWeaves',
                items: 'all'
              },
              {
                section: 'rmRetailers',
                items: 'all'
              }
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'reports',
          items: ['allReports']
        }
      ],
      actions: [
        
        {
          component: 'YarnListingComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnOrdersComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnOrderDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'WeaverDetailsComponent',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'YarnDetailsComponent',
          action: ['edit', 'invoice']
        }
      ],
    },
    {
      role: 'RetailSourcingAgent',
      menu: [
  
              {
                section: 'rmWeaves',
                items: 'all'
              },
              {
                section: 'rmRetailers',
                items: 'all'
              }
            ],
      topMenu: [
        {
          section: 'followUps',
          items: ['myFollowUps']
        },
        {
          section: 'reports',
          items: ['allReports']
        }
      ],
      actions: [
        
        {
          component: 'YarnListingComponent',
          action: ['edit', 'invoice',]
        },
        {
          component: 'YarnOrdersComponent',
          action: ['edit', 'invoice',]
        },
        {
          component: 'YarnOrderDetailsComponent',
          action: ['edit', 'invoice',]
        },
        {
          component: 'WeaverDetailsComponent',
          action: ['edit', 'invoice',]
        },
        {
          component: 'YarnDetailsComponent',
          action: ['edit', 'invoice',]
        }
      ],
    },
    {
      role: 'ItemMaster',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
              {
                section: 'rmSathi',
                items: 'all'
              },
              {
                section: 'rmFarms',
                items: 'all'
              },
              {
                section: 'rmCare',
                items: 'all'
              },
              {
                section: 'rmReels',
                items: 'all'
              },
              {
                section: 'rmWeaves',
                items: 'all'
              },
              {
                section: 'rmRetailers',
                items: 'all'
              }
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'reports',
          items: ['allReports']
        },
        {
          section: 'adminstration',
          items: 'all'
        },
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: ['edit']
        },
        {
          component: 'CocoonListComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'DispatchedCocoonLots',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'CocoonDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'CocoonOrdersComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'CocoonOrderDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'ReelerDetailsComponent',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'YarnListingComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnOrdersComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnOrderDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'WeaverDetailsComponent',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'YarnDetailsComponent',
          action: ['edit', 'invoice']
        }
      ],
    },
    {
      role: 'RetailMerchandisingManager',
      menu: [
              
              {
                section: 'rmWeaves',
                items: 'all'
              },
              {
                section: 'rmRetailers',
                items: 'all'
              }
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'reports',
          items: ['allReports']
        }
      ],
      actions: [
        
        {
          component: 'YarnListingComponent',
          action: ['invoice']
        },
        {
          component: 'YarnOrdersComponent',
          action: ['invoice']
        },
        {
          component: 'YarnOrderDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'WeaverDetailsComponent',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'YarnDetailsComponent',
          action: ['edit', 'invoice']
        }
      ],
    },
    {
      role: 'LogisticsManager',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
              {
                section: 'rmSathi',
                items: 'all'
              },
              {
                section: 'rmFarms',
                items: 'all'
              },
              {
                section: 'rmCare',
                items: 'all'
              },
              {
                section: 'rmReels',
                items: 'all'
              },
              {
                section: 'rmWeaves',
                items: 'all'
              },
              {
                section: 'rmRetailers',
                items: 'all'
              },
              {
                section: 'rmPupae',
                items: 'all'
              },
              {
                section: 'rmCotton',
                items: 'all'
              },
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'reports',
          items: ['allReports']
        }
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: ['edit']
        },
        {
          component: 'CocoonListComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'DispatchedCocoonLots',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'CocoonDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'CocoonOrdersComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'CocoonOrderDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'ReelerDetailsComponent',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'YarnListingComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnOrdersComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnOrderDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'WeaverDetailsComponent',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'YarnDetailsComponent',
          action: ['edit', 'invoice']
        }
      ],
    },
    {
      role: 'MudraManager',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
  
              {
                section: 'rmPupae',
                items: 'all'
              },
              {
                section: 'rmSathi',
                items: 'all'
              },
              {
                section: 'rmFarms',
                items: 'all'
              },
              {
                section: 'rmCotton',
                items: 'all'
              },
              {
                section: 'rmReels',
                items: 'all'
              },
              {
                section: 'rmWeaves',
                items: 'all'
              },
              {
                section: 'rmRetailers',
                items: 'all'
              },
              {
                section: 'reshaMudra',
                items: 'all'
              }
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'adminstration',
          items: 'all'
        },
        {
          section: 'reports',
          items: 'all'
        }
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: []
        },
        {
          component: 'CocoonListComponent',
          action: ['invoice', 'payment']
        },
        {
          component: 'DispatchedCocoonLots',
          action: ['invoice']
        },
        {
          component: 'CocoonDetailsComponent',
          action: ['invoice', 'payment']
        },
        {
          component: 'CocoonOrdersComponent',
          action: ['invoice', 'payment']
        },
        {
          component: 'CocoonOrderDetailsComponent',
          action: ['invoice', 'payment']
        },
        {
          component: 'ReelerDetailsComponent',
          action: ['invoice','payment']
        },
        {
          component: 'YarnListingComponent',
          action: ['invoice','payment']
        },
        {
          component: 'YarnOrdersComponent',
          action: ['invoice','payment']
        },
        {
          component: 'YarnOrderDetailsComponent',
          action: ['invoice','payment']
        },
        {
          component: 'WeaverDetailsComponent',
          action: ['invoice','payment']
        },
        {
          component: 'YarnDetailsComponent',
          action: ['invoice','payment']
        }
      ],
    },
    {
      role: 'MudraAgent',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
  
              {
                section: 'rmPupae',
                items: 'all'
              },
              {
                section: 'rmSathi',
                items: 'all'
              },
              {
                section: 'rmFarms',
                items: 'all'
              },
              {
                section: 'rmCotton',
                items: 'all'
              },
              {
                section: 'rmReels',
                items: 'all'
              },
              {
                section: 'rmWeaves',
                items: 'all'
              },
              {
                section: 'rmRetailers',
                items: 'all'
              },
              {
                section: 'reshaMudra',
                items: 'all'
              }
            ],
      topMenu: [
        {
          section: 'followUps',
          items: ['myFollowUps']
        },
        {
          section: 'adminstration',
          items: 'all'
        },
        {
          section: 'reports',
          items: 'all'
        }
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: []
        },
        {
          component: 'CocoonListComponent',
          action: ['invoice']
        },
        {
          component: 'DispatchedCocoonLots',
          action: ['invoice']
        },
        {
          component: 'CocoonDetailsComponent',
          action: ['invoice']
        },
        {
          component: 'CocoonOrdersComponent',
          action: ['invoice']
        },
        {
          component: 'CocoonOrderDetailsComponent',
          action: ['invoice']
        },
        {
          component: 'ReelerDetailsComponent',
          action: ['invoice']
        },
        {
          component: 'YarnListingComponent',
          action: ['invoice']
        },
        {
          component: 'YarnOrdersComponent',
          action: ['invoice']
        },
        {
          component: 'YarnOrderDetailsComponent',
          action: ['invoice']
        },
        {
          component: 'WeaverDetailsComponent',
          action: ['invoice']
        },
        {
          component: 'YarnDetailsComponent',
          action: ['invoice']
        }
      ],
    },
    {
      role: 'HRManager',
      menu: [],
      topMenu: [
        {
          section: 'adminstration',
          items: 'all'
        }
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: ['edit']
        },
        {
          component: 'CocoonListComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'DispatchedCocoonLots',
          action: ['edit', 'invoice']
        },
        {
          component: 'CocoonDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'CocoonOrdersComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'CocoonOrderDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'ReelerDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnListingComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnOrdersComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnOrderDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'WeaverDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnDetailsComponent',
          action: ['edit', 'invoice']
        }
      ],
    },
    {
      role: 'PupaeManager',
      menu: [
  
              {
                section: 'rmPupae',
                items: 'all'
              },
              {
                section: 'rmFarms',
                items: 'all'
              },
            ],
      topMenu: [
        {
          section: 'followUps',
          items: ['myFollowUps']
        },
        {
          section: 'reports',
          items: 'all'
        }
      ],
      actions: [
      ],
    },
    {
      role: 'PupaeAgent',
      menu: [
  
              {
                section: 'rmPupae',
                items: 'all'
              },
              {
                section: 'rmFarms',
                items: 'all'
              },
            ],
      topMenu: [
        {
          section: 'followUps',
          items: ['myFollowUps']
        }
      ],
      actions: [
      ],
    },
    {
      role: 'Merchandiser',
      menu: [
        {
          section: 'rmWeaves',
          items: 'all'
        },
        {
          section: 'rmRetailers',
          items: 'all'
        }
      ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'reports',
          items: ['allReports']
        }
      ],
      actions: [
        {
          component: 'CocoonOrdersComponent',
          action: ['edit', 'invoice','payment']
        },
        {
          component: 'CocoonOrderDetailsComponent',
          action: ['edit', 'invoice','payment']
        },
        {
          component: 'ReelerDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnListingComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnDetailsComponent',
          action: ['edit', 'invoice']
        }
      ],
    },
    {
      role: 'CVerticalAdmin',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
  
              {
                section: 'rmPupae',
                items: 'all'
              },
              {
                section: 'rmFarms',
                items: 'all'
              },
              {
                section: 'rmCotton',
                items: 'all'
              },
              {
                section: 'rmSathi',
                items: 'all'
              },
              {
                section: 'rmCare',
                items: 'all'
              }
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'adminstration',
          items: 'all'
        },
        {
          section: 'reports',
          items: 'all'
        }
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: ['edit']
        },
        {
          component: 'CocoonListComponent',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'DispatchedCocoonLots',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'CocoonDetailsComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'CocoonOrdersComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'CocoonOrderDetailsComponent',
          action: ['edit', 'invoice', 'payment']
        },
        {
          component: 'ReelerDetailsComponent',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'YarnListingComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnOrdersComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnOrderDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'WeaverDetailsComponent',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'YarnDetailsComponent',
          action: ['edit', 'invoice']
        }
      ],
    },
    {
      role: 'COCOON_PROCUREMENT_HEAD',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
  
            
              {
                section: 'rmFarms',
                items: 'all'
              },
 
              {
                section: 'rmSathi',
                items: 'all'
              },
              {
                section: 'rmCare',
                items: 'all'
              }
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'adminstration',
          items: 'all'
        },
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: ['edit']
        },
        {
          component: 'CocoonListComponent',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'DispatchedCocoonLots',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'CocoonDetailsComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'CocoonOrdersComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'CocoonOrderDetailsComponent',
          action: ['edit', 'invoice', 'payment']
        },
      ],
    },
    {
      role: 'COCOON_SALES_HEAD',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
  
              {
                section: 'rmFarms',
                items: 'all'
              },
              
              {
                section: 'rmSathi',
                items: 'all'
              },
              {
                section: 'rmCare',
                items: 'all'
              }
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'adminstration',
          items: 'all'
        },
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: ['edit']
        },
        {
          component: 'CocoonListComponent',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'DispatchedCocoonLots',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'CocoonDetailsComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'CocoonOrdersComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'CocoonOrderDetailsComponent',
          action: ['edit', 'invoice', 'payment']
        },
        {
          component: 'ReelerDetailsComponent',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'YarnListingComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnOrdersComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'YarnOrderDetailsComponent',
          action: ['edit', 'invoice']
        },
        {
          component: 'WeaverDetailsComponent',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'YarnDetailsComponent',
          action: ['edit', 'invoice']
        }
      ],
    },

    {
      role: 'BusinessHead',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
  
              {
                section: 'rmPupae',
                items: 'all'
              },
              {
                section: 'rmFarms',
                items: 'all'
              },
              {
                section: 'rmCotton',
                items: 'all'
              },
              {
                section: 'rmSathi',
                items: 'all'
              },
              {
                section: 'rmCare',
                items: 'all'
              },
              {
                section: 'rmReels',
                items: 'all'
              },
              {
                section: 'rmWeaves',
                items: 'all'
              },
              {
                section: 'rmRetailers',
                items: 'all'
              },
              {
                section: 'reshaMudra',
                items: 'all'
              }
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'adminstration',
          items: 'all'
        },
        {
          section: 'reports',
          items: 'all'
        }
      ],
      actions: [
        {
          component: 'FarmersViewComponent',
          action: ['edit']
        },
        {
          component: 'CocoonListComponent',
          action: ['edit', 'invoice', 'delete']
        },
        {
          component: 'DispatchedCocoonLots',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'CocoonDetailsComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'CocoonOrdersComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'CocoonOrderDetailsComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'ReelerDetailsComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'YarnListingComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'YarnOrdersComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'YarnOrderDetailsComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'WeaverDetailsComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        },
        {
          component: 'YarnDetailsComponent',
          action: ['edit', 'invoice', 'payment', 'delete']
        }
      ],
    },
    {
      role: 'YARN_SOURCING_EXECUTIVE',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
              {
                section: 'rmReels',
                items: ['yarnBookings']
              }
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'reports',
          items: 'all'
        }
      ],
      actions: [
      ],
    },
    {
      role: 'YARN_SOURCING_MANAGER',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
              {
                section: 'rmReels',
                items: ['yarnBookings']
              }
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'reports',
          items: 'all'
        }
      ],
      actions: [
      ],
    },
    {
      role: 'QC_AGENT',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
              {
                section: 'rmReels',
                items: ['yarnQC']
              }
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'reports',
          items: 'all'
        }
      ],
      actions: [
      ],
    },
    {
      role: 'QC_MANAGER',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
              {
                section: 'rmReels',
                items: ['yarnQC']
              }
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'reports',
          items: 'all'
        }
      ],
      actions: [
      ],
    },
    {
      role: 'YARN_PACKAGING_MANAGER',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
              {
                section: 'rmReels',
                items: ['yarnPackagings', 'yarnInventory']
              }
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'reports',
          items: 'all'
        }
      ],
      actions: [
      ],
    },
    {
      role: 'YARN_SALES_MANAGER',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
              {
                section: 'rmReels',
                items: ['yarnInventory', 'yarnBookings']
              },
              {
                section: 'rmWeaves',
                items: 'all'
              },
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'reports',
          items: 'all'
        }
      ],
      actions: [
      ],
    },
    {
      role: 'YARN_SALES_REPRESENTATIVE',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
              {
                section: 'rmReels',
                items: ['yarnInventory', 'yarnBookings']
              },
              {
                section: 'rmWeaves',
                items: 'all'
              },
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'reports',
          items: 'all'
        }
      ],
      actions: [
      ],
    },
    {
      role: 'YARN_DISPATCH_MANAGER',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
              {
                section: 'rmReels',
                items: ['yarnBookings', 'yarnInventory']
              },
              {
                section: 'rmWeaves',
                items: 'all'
              },
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'reports',
          items: 'all'
        }
      ],
      actions: [
      ],
    },
      {
        role: 'YARN_BUSINESS_MANAGER',
        menu: [
                {
                  section: 'open',
                  items: 'all'
                },
                {
                  section: 'rmReels',
                  items: ['yarnBookings', 'yarnPurchaseApprovals', 'yarnPackagings', 'yarnInventory', 'yarnQC']
                },
                {
                  section: 'rmWeaves',
                  items: 'all'
                },
              ],
        topMenu: [
          {
            section: 'followUps',
            items: 'all'
          },
          {
            section: 'reports',
            items: 'all'
          }
        ],
        actions: [
          {
            component: 'YarnOrdersComponent',
            action: ['edit', 'invoice', 'payment', 'delete']
          }
        ],
      },
    {
      role: 'INWARD_WAREHOUSE_MANAGER',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
              {
                section: 'rmReels',
                items: 'all'
              },
              {
                section: 'rmWeaves',
                items: 'all'
              },
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'reports',
          items: 'all'
        }
      ],
      actions: [
      ],
    },
    {
      role: 'CollectionAdmin',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
  
              {
                section: 'rmPupae',
                items: 'all'
              },
              {
                section: 'rmFarms',
                items: 'all'
              },
              {
                section: 'rmCotton',
                items: 'all'
              },
              {
                section: 'rmSathi',
                items: 'all'
              },
              {
                section: 'rmCare',
                items: 'all'
              },
              {
                section: 'rmReels',
                items: 'all'
              },
              {
                section: 'rmWeaves',
                items: 'all'
              },
              {
                section: 'rmRetailers',
                items: 'all'
              }
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'adminstration',
          items: 'all'
        },
        {
          section: 'reports',
          items: 'all'
        },
        {
          section: 'collections',
          items: 'all'
        }
      ],
      actions: [
        
      ],
    },
    {
      role: 'CollectionManager',
      menu: [
              {
                section: 'open',
                items: 'all'
              },
  
              {
                section: 'rmPupae',
                items: 'all'
              },
              {
                section: 'rmFarms',
                items: 'all'
              },
              {
                section: 'rmCotton',
                items: 'all'
              },
              {
                section: 'rmSathi',
                items: 'all'
              },
              {
                section: 'rmCare',
                items: 'all'
              },
              {
                section: 'rmReels',
                items: 'all'
              },
              {
                section: 'rmWeaves',
                items: 'all'
              },
              {
                section: 'rmRetailers',
                items: 'all'
              }
            ],
      topMenu: [
        {
          section: 'followUps',
          items: 'all'
        },
        {
          section: 'adminstration',
          items: 'all'
        },
        {
          section: 'reports',
          items: 'all'
        },
        {
          section: 'collections',
          items: 'all'
        }
      ],
      actions: [
        
      ],
    },
  ];

  constructor() { }
  checkAccess(role, data) {
    let currentRole = null;
    for (const roleData of this.appRoles) {
      if (role.includes(roleData.role)) {
        currentRole = roleData;
        break;
      }
    }
    if (data && data.type === 'menu' && currentRole && currentRole['menu'] && currentRole['menu'].length > 0) {
      for (const menu of currentRole['menu']) {
        if (menu['section'] && data['section'] && menu['section'] === data['section']) {
          if(!data['item']){           
            return true;

          }else if (Array.isArray(menu['items'])){
            for (const mItem of menu['items']) {
              if (mItem === data['item']) {
                return true;
              }
            }
            return false;
          } else if (menu['items'] === 'all') {
            return true;
          } else {
            return false;
          }
        }
      }
      return false;
    } else if (data && data.type === 'actions' && currentRole && currentRole['actions'] && currentRole['actions'].length > 0) {
      for (const action of currentRole['actions']) {
        if (action['component'] && data['component'] && action['component'] === data['component']) {
          if (Array.isArray(action['action'])){
            for (const mItem of action['action']) {
              if (mItem === data['action']) {
                return true;
              }
            }
            return false;
          } else if (action['items'] === 'all') {
            return true;
          } else {
            return false;
          }
        }
      }
      return false;
    } else if (data && data.type === 'topMenu' && currentRole && currentRole['topMenu'] && currentRole['topMenu'].length > 0) {
      for (const topMenu of currentRole['topMenu']) {
        if (topMenu['section'] && data['section'] && topMenu['section'] === data['section']) {
          
          if(!data['item']){            
            return true;
          } else if (Array.isArray(topMenu['items'])){
            for (const mItem of topMenu['items']) {
              if (mItem === data['item']) {
                return true;
              }
            }
            return false;
          } else if (topMenu['items'] === 'all') {
            return true;
          } else {
            return false;
          }
        }
      }
      return false;
    }
     else {
      return false;
    }
  }
}
