import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-note-logs',
  templateUrl: './note-logs.component.html',
  styleUrls: ['./note-logs.component.scss']
})
export class NoteLogsComponent implements OnInit {
  expandImage=false;
  modelImage='';
  @Input() notesList: any = [];

  constructor() { }
  
  ngOnInit(): void {
    
  }

  openMap(lat, lng){
    window.open("http://maps.google.com/maps?q=loc:" + lat + "," + lng, '_blank')
  }

  showImage(item) {
    this.modelImage = item.imageUrl;
    this.expandImage = true;
  }

}
