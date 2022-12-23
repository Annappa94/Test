import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirstLetterPipe } from './pipes/first-letter.pipe';
import { SafePipe } from './pipes/safe.pipe';
import { SearchPipe } from './pipes/search/search.pipe';

@NgModule({
  declarations: [FirstLetterPipe, SafePipe, SearchPipe],
  imports: [CommonModule],
  exports: [FirstLetterPipe, SafePipe, SearchPipe],
})
export class CoreModule { }
