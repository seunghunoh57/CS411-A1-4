import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient,private router: Router) {}

  login(credentials) {
    interface JSONdata{
      success: boolean, 
      message: string, 
      token: string
    }
    return this.http.post<JSONdata>('/auth/login', credentials)
      .subscribe(
        // We're assuming the response will be an object
        // with the JWT on an id_token key
        data => {
            if(data.success==true){
              localStorage.setItem('jwt', data.token);
              this.router.navigate(['search-twitter']);
            }
        },
        error => console.log(error),
      );
  }

  getToken(): string{
    console.log(localStorage.getItem('jwt'));
    return localStorage.getItem('jwt');
  }

  logout() {
    localStorage.removeItem('jwt');
    // localStorage.removeItem("expires_at");
  }

  public isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    // return a boolean reflecting 
    // whether or not the token is expired
    if (token) return true;
    return false;
  }

}
