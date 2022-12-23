import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'submit-button',
  templateUrl: './loading-button.component.html',
  styleUrls: ['./loading-button.component.scss']
})
export class LoadingButtonComponent implements OnInit {

  constructor() { }

  @Input()
  disabledButton:Boolean=false;

  @Input()
  loading:Boolean=false;

  @Output()
  clickButton:EventEmitter<any>= new EventEmitter();

  @Input()
  text:String="Save";

  ngOnInit(): void {
  }
  buttonClick(){
    this.clickButton.emit();
  }

}
