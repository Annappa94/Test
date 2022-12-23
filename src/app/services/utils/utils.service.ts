import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

/** Utility Service for all adhoc functions in OCC */
export class UtilsService {
    
    constructor(
        //Nothign right now
    ) { }

    /** Function to get display date from epoch timestamp */
    getDisplayTime(timestamp) {
        
        return (new Date(timestamp)).toLocaleString(('en-IN'), {day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'});
    }
    /** Function to get display date from epoch date */
    getDisplayDate(timestamp) {
        return (new Date(timestamp)).toLocaleDateString(('en-IN'));
    }

    convertToNumber(input) {
        return parseInt(input)
    }

    camelCaseToWords(str) {
        return str
          .replace(/^[a-z]/g, char => ` ${char.toUpperCase()}`)
          .replace(/[A-Z]|[0-9]+/g, ' $&')
          .replace(/(?:\s+)/, char => '');
      };

}
