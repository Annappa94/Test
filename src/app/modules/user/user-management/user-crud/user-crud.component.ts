import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { EMAIL } from 'src/app/constants/enum/regex.validator';
import { ApiService } from 'src/app/services/api/api.service';
import { CustomValidator } from 'src/app/pages/custom-validator/custom.validator';

@Component({
    selector: 'app-user-crud',
    templateUrl: 'user-crud.html',
    styleUrls: ['./user-crud.component.scss']
})
export class UserCRUDComponent {
    id;
    userCreateForm: UntypedFormGroup;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private form: UntypedFormBuilder,
        private api: ApiService,
        private snackBar: MatSnackBar,
        private ngxLoader : NgxUiLoaderService,
    ) {
        this.route.params.subscribe((params: Params) => {
            if (params['id']) {
                this.id = params['id'];
            }
        });
        this.userCreateForm = this.form.group({
            name: ['', [Validators.required, CustomValidator.cannotContainOnlySpace]],
            phone: new UntypedFormControl('', [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]),
            roles: new UntypedFormControl('', Validators.required),
            email: new UntypedFormControl('',[Validators.required, Validators.pattern(EMAIL)])
        });
        this.getRoles();
        if (this.id) {
            this.ngxLoader.stop();
            this.api.getUserById(this.id).then(res => {
                if (res) {
                    this.userCreateForm.patchValue(res);
                    this.userCreateForm.get('roles').patchValue(res['roles'].map(ele => ele.id))
                    // res['roles'].forEach((element, index) => {
                    //     this.userCreateForm.get('roles').value.push(element.id);
                    // });
                } else {
                    this.snackBar.open(' Details Not Found', 'Ok', {
                        duration: 3000
                    });
                }
            });
        }


    }
    rolesList=[];
    async getRoles(){
        this.api.getAllRoles().then(res=> {
            this.rolesList = res['_embedded']['role']
        })
    }
    goBack() {
        this.router.navigate(['/users']);
    }
    submitUser(value) {
        let userRoles = [];
        value.roles.forEach(element => {
            let obj = {
                'role': 'role/'+element
            }
            userRoles.push(obj)
        });
        const params = {
            'name': value.name,
            'phone': value.phone,
            'userRoles': userRoles,
            email: value.email
        }
        if (this.id) {
            this.ngxLoader.stop();
            this.api.updateUser(this.id, params).then(res => {
                if (res) {
                    this.router.navigate(['/users']);

                    this.snackBar.open(' User updated successfully', 'Ok', {
                        duration: 3000
                    });
                } else {
                    this.snackBar.open(' User update failed', 'Ok', {
                        duration: 3000
                    });
                }
            });
        } else {
            this.ngxLoader.stop();
            this.api.userOnBoarding(params).then(res => {
                if (res) {
                    this.router.navigate(['/users']);
                    this.snackBar.open(' User created successfully', 'Ok', {
                        duration: 3000
                    });
                }else {
                    this.snackBar.open(' User create failed', 'Ok', {
                        duration: 3000
                    });
                }
            });
        }

    }
    // helpers for View
    isControlValid(controlName: string): boolean {
        const control = this.userCreateForm.controls[controlName];
        return control.valid && (control.dirty || control.touched);
    }

    isControlInvalid(controlName: string): boolean {
        const control = this.userCreateForm.controls[controlName];
        return control.invalid && (control.dirty || control.touched);
    }

    controlHasError(validation, controlName): boolean {
        const control = this.userCreateForm.controls[controlName];
        return control.hasError(validation) && (control.dirty || control.touched);
    }

    isControlTouched(controlName): boolean {
        const control = this.userCreateForm.controls[controlName];
        return control.dirty || control.touched;
    }
}