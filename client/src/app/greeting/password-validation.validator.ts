import {AbstractControl} from '@angular/forms';
export class PasswordValidation {
    
    static MatchPassword(AC: AbstractControl) {
       let password = AC.get('password').value; // to get value in input tag
       let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
        if(password != confirmPassword) {
            console.log('false');
            AC.get('confirmPassword').setErrors( {MatchPassword: false} )
            // return false;
        } else {
            console.log('true')
            AC.get('confirmPassword').setErrors( {MatchPassword: true} )

            // return true;
        }
    }
}
