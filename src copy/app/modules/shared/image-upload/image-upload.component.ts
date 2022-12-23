import { EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ChangeDetectorRef, Component, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit,OnChanges {

  constructor(
    private _cd: ChangeDetectorRef,
    ) { }

  @Input()
  index:number;
  @Input()
  img:any=false;
  @Input()
  flag:any;
  @Output()
  prevImage:EventEmitter<any>=new EventEmitter();

  displayImg=null;

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    try{      
      this.displayImg=this.img.imageUrl || this.img.url;
    }catch(err){
      console.log(err)
    }
  }

  onImageUpload(image, index) {
    if (image) {
      const file = image.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        let previewImage = reader.result as string;
        this.displayImg=previewImage;
        this.prevImage.emit({fileType:file.type,file,index,flag:this.flag});
        // taskListArrays.controls[index].patchValue({ "previewImage": previewImage });
        this._cd.detectChanges();
      };
      // this.getS3Url(file.type,file,index);
      reader.readAsDataURL(file);
     }
  }

}
