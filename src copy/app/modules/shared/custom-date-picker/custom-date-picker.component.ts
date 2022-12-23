import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-custom-date-picker',
  templateUrl: './custom-date-picker.component.html',
  styleUrls: ['./custom-date-picker.component.scss']
})
export class CustomDatePickerComponent implements OnInit {
  form :  UntypedFormGroup
  constructor(private _cd :ChangeDetectorRef) { 
    this.formInitialize();
  }
  @Output()
  listenForDate : EventEmitter<any> = new EventEmitter();

  @Input()
  startTitle:String = 'start date';
  @Input()
  endTitle:String = 'end Date';
  @Input() events: Observable<void>;

  removeFromAndToDate(){
    this.form.patchValue({
     start:'',
     end:''
    })
  }
  listenForEvent(){
    this.events?.subscribe(val=>{
     this.removeFromAndToDate();
    })
  }

  ngOnInit(): void {
    this.listenFormFormValueChange();
    this.listenForEvent();
  }
  listenFormFormValueChange(){
    this.form.valueChanges.subscribe(value=>{
      (this.form.valid)&&this.listenForDate.emit({start:Date.parse(value['start']), end:Date.parse(value['end'].set({ hour: 23, minute: 59, second: 59, millisecond: 0 }))});
      this._cd.detectChanges();
    })
  }
  formInitialize(){
    this.form = new UntypedFormGroup({
      start :new UntypedFormControl('',Validators.required),
      end :new UntypedFormControl('',Validators.required)
    })
  }
}