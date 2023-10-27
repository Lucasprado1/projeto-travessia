import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  constructor(private router: Router) {}
    login(){
      if(1+1 == 2){
        this.router.navigate(['/report']);
      }
    }
}
