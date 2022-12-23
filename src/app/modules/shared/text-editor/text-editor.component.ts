import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as Quill from 'quill';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit,OnChanges {
  editor:any;
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    
      if(this.dataEdit) {
        this.editor.root.innerHTML=this.dataEdit;
        this.dataEdit = null;
      }
  }

  @Output()
  innerHtmldata:EventEmitter<any> = new EventEmitter();

  @Input()
  data:any;

 @Input()
  dataEdit:any;

  @ViewChild('editor', { static: true }) editorContent: ElementRef;
    
  ngOnInit(): void {
    const options = {
      // debug: 'info',
      placeholder: 'Compose...',
      // readOnly: true,
      theme: 'snow',
      modules: {
        'syntax': false,
        'toolbar': [
          [{ 'font': [] }, { 'size': [] }],
          [ 'bold', 'italic', 'underline', 'strike' ],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'script': 'super' }, { 'script': 'sub' }],
          [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block' ],
          [{ 'list': 'ordered' }, { 'list': 'bullet'}, { 'indent': '-1' }, { 'indent': '+1' }],
          [ 'direction', { 'align': [] }],
          [ 'link', 'image', 'video', 'formula' ],
          [ 'clean' ]
      ]
     }
    };
    this.editor = new Quill(this.editorContent.nativeElement,options);
    this.editor.on('text-change', (delta, oldContents, source) => {
      this.innerHtmldata.emit(this.editorContent.nativeElement.children[0].innerHTML);
    });

    if(this.data) {
      this.editor.root.innerHTML=this.data;
      this.data = null;
    }
  }
}
