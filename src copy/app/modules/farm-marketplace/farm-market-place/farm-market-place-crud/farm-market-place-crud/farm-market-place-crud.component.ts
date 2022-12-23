import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _moment from 'moment';
import { ApiService } from 'src/app/services/api/api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-farm-market-place-crud',
  templateUrl: './farm-market-place-crud.component.html',
  styleUrls: ['./farm-market-place-crud.component.scss']
})
export class FarmMarketPlaceCrudComponent implements OnInit {
  crudForm: UntypedFormGroup;
  base64Url;
  id;
  marketPlaceDatabyId;
  imageUploaded = false;
  imageFile = null;
  previewImage: string | ArrayBuffer;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private form: UntypedFormBuilder,
    private api: ApiService,
    private _cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private ngxLoader : NgxUiLoaderService,
  ) {
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
      }
    });
    this.crudForm = this.form.group({
      name: new UntypedFormControl('', Validators.required),
      price: new UntypedFormControl(''),
      marketPrice: new UntypedFormControl(''),
      description: new UntypedFormControl(''),
    });
    if (this.id){
      this.ngxLoader.stop();
      this.api.getFarmMarketPlaceById(this.id).then(response => {
        //console.log(response);
        this.marketPlaceDatabyId = response;
        this.previewImage = this.marketPlaceDatabyId['imageUrls'][0];
        //console.log(this.marketPlaceDatabyId);
        if (response){
          this.crudForm.patchValue(response)
        }
        this._cd.detectChanges();
      });
    } else{
      this.marketPlaceDatabyId = {
        imageUrls: []
      };
    }
  }

  ngOnInit(): void {
  }
  remove(){
    this.previewImage = undefined;
    if (this.marketPlaceDatabyId) {
      this.marketPlaceDatabyId['imageUrls'] = [];
    }
    this.imageUploaded = false;
    this.imageFile = null;
  }
  getPic() {
    if (!this.imageUploaded){
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.marketPlaceDatabyId['imageUrls'][0]);
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.base64Url);
    }
  }
  onImageUpload(image){
    this.imageFile = image;
    if (image) {
      const file = image.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
        this._cd.detectChanges();
      };
      reader.readAsDataURL(file);
      this.imageUploaded = true;
    }
  }
  onSubmit(formValue){
    const params = {
      name: formValue.name,
      price: formValue.price,
      marketPrice: formValue.marketPrice,
      description: formValue.description,
      isActive: this.marketPlaceDatabyId?.isActive ? this.marketPlaceDatabyId.isActive : false
    };
    if (this.id) {
      if (this.marketPlaceDatabyId['imageUrls'].length === 0 && this.imageUploaded === false){
        params['imageUrls'] = [];
      }
      this.ngxLoader.stop();
      this.api.updateFarmMktPlc(params,this.id).then(res => {
        if (res) {
          // Success Message
          if (this.imageUploaded){
              this.api.uploadMktPlaceImages(this.imageFile.target.files[0], res['id']).then(res => {
                // this.snackBar.open('Uploaded successfully', 'Ok', {
                //   duration: 3000
                // });
                setTimeout(() => {
                  this._cd.detectChanges();
                  this.router.navigate(['/resha-farms/farm-marketplace']);
                  this.snackBar.open('Created successfully', 'Ok', {
                    duration: 3000
                  });
                }, 500);
              }, err => {
                this.snackBar.open('Could not upload, Please try again', 'Ok', {
                  duration: 3000
                });
              });
          } else {
            this.router.navigate(['/resha-farms/farm-marketplace']);
            this.snackBar.open('Updated successfully', 'Ok', {
              duration: 3000
            });
          }
        } else {
          this.snackBar.open('Failed to update farmer', 'Ok', {
            duration: 3000
          });
        }
      });
    } else {
      // params['imageUrls'] = [];
      if (this.marketPlaceDatabyId['imageUrls'].length === 0 && this.imageUploaded === false){
        params['imageUrls'] = [];
      }
      this.ngxLoader.stop();
      this.api.farmMktPlcOnboarding(params).then(res => {
        if (res) {
          // Success Message
          if (this.imageUploaded){
            this.api.uploadMktPlaceImages(this.imageFile.target.files[0], res['id']).then(res => {
              // this.snackBar.open('Uploaded successfully', 'Ok', {
              //   duration: 3000
              // });
              setTimeout(() => {
                this.router.navigate(['/resha-farms/farm-marketplace']);
                this.snackBar.open('Created successfully', 'Ok', {
                  duration: 3000
                });
              }, 500);
            }, err => {
              this.snackBar.open('Could not upload, Please try again', 'Ok', {
                duration: 3000
              });
            });
          } else {
            this.router.navigate(['/resha-farms/farm-marketplace']);
            this.snackBar.open('Created successfully', 'Ok', {
              duration: 3000
            });
          }
        } else {
          this.snackBar.open('Failed to created farmer', 'Ok', {
            duration: 3000
          });
        }
      });
    }
  }
  goBack() {
    this.router.navigate(['/resha-farms/farm-marketplace']);
  }
  isControlValidForReeler(controlName: string): boolean {
    const control = this.crudForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalidForReeler(controlName: string): boolean {
    const control = this.crudForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasErrorForReeler(validation, controlName): boolean {
    const control = this.crudForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouchedForReeler(controlName): boolean {
    const control = this.crudForm.controls[controlName];
    return control.dirty || control.touched;
  }
}
