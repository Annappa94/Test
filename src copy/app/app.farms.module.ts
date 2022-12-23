import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartsModule } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppComponent } from './app.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { RouterModule } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

import { AuthInterceptor } from './services/interceptors/auth.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    CommonModule,
    MatSnackBarModule,
    AppRoutingModule,
    ChartsModule,
    NgApexchartsModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    PdfViewerModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    MatMomentDateModule,
    NgxMatSelectSearchModule,
    CommonModule,
    ChartsModule,
    NgxUiLoaderModule,
    ToastrModule
  ],
  exports: [
    PdfViewerModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule,
    RouterModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          xml: () => import('highlight.js/lib/languages/xml'),
          typescript: () => import('highlight.js/lib/languages/typescript'),
          scss: () => import('highlight.js/lib/languages/scss'),
          json: () => import('highlight.js/lib/languages/json')
        },
      },
    },
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]


})
export class AppFarmsModule { }
