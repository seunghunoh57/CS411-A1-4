import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { PasswordValidation } from './password-validation.validator';
import { Router } from '@angular/router';

@Component({
  selector: 'greeting',
  templateUrl: './greeting.component.html',
  styleUrls: ['./greeting.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GreetingComponent  {

  rForm: FormGroup;
  post:any;                     // A property for our submitted form
  email:string = '';
  password:string = '';
  confirmPassword:string = '';
  emailError:string = 'Enter a valid email';
  passwordError:string = 'Enter a password of atleast 5 characters';
  mismatch:string = 'Passwords dont match';
  matchPW: boolean = false;
  emailFocus: boolean = false;
  loginError: string = '';
  message: Object;
  constructor(private auth: AuthService,private fb: FormBuilder, public http: HttpClient, public router: Router){
    this.rForm = fb.group({
      'email' : [null, Validators.compose([Validators.email,Validators.required])],
      'password' : [null, Validators.compose([Validators.required,Validators.minLength(5)])],
      'confirmPassword' : [null, Validators.compose([Validators.required,Validators.minLength(5)])],
      validator: PasswordValidation.MatchPassword // custom validation method
      },
      {validator: this.checkIfMatchingPasswords('password', 'confirmPassword')});
  }

  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
          passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notEquivalent: true})
      }
      else {
          return passwordConfirmationInput.setErrors(null);
      }
    }
  }

  Register(form) {
    interface regJSON{
      message: string,
      valid: boolean
    }
    this.http.post<regJSON>('/auth/create', form).subscribe(
        data=>{
          this.message = data;
          if(data.valid == true) this.rForm.reset();
        }
      );

  }
  Login(form:NgForm){
    if(form.value. email && form.value.password){
      this.auth.login(form.value).subscribe(
        data => {
            if(data.success==true){
              localStorage.setItem('jwt', data.token);
              this.router.navigate(['home']);
            }
            else{
              this.loginError = "Incorrect Login Info";
            }
        },
        error => console.log('error'),
      );
    }
  }

}
