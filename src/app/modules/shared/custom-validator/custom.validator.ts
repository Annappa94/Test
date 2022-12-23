import { AbstractControl, ValidationErrors } from '@angular/forms'; 

export class CustomValidator {

    static cannotContainOnlySpace(control: AbstractControl) : ValidationErrors | null {
        
        try{
            if((control.value as string).trim().length==0){
                return {cannotContainSpace: true}
            }
        }catch(err){
            return null;
        }
        return null;
    }

}