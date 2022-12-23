import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  transform(items: any[], search: string): any[] {
    if (!items) {
      return [];
    }
    if (!search) {
      return items;
    }
    search = search.toLowerCase();
    return items.filter(it => {
      return JSON.stringify(it).toLowerCase().includes(search);
    });
  }
}
